from pathlib import Path

import joblib
import pandas as pd

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.station import Station
from app.models.occupancy import Occupancy
from app.models.frequency_adjustment import FrequencyAdjustment

from app.schemas.frequency_adjustment import (
    FrequencyAdjustmentRequest,
    FrequencyAdjustmentResponse,
)


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "frequency_xgboost.pkl"
)

frequency_model = joblib.load(MODEL_PATH)


MODEL_FEATURES = [
    "occupancy",
    "capacity",
    "occupancy_percentage",
    "occupancy_ratio",
    "hour",
    "minute",
    "day",
    "month",
    "day_of_week",
    "is_weekend",
    "peak_hour",
]


ACTION_MAPPING = {
    0: "Decrease",
    1: "Maintain",
    2: "Increase",
}


class FrequencyAdjustmentService:

    @staticmethod
    def recommend(
        db: Session,
        request: FrequencyAdjustmentRequest,
    ):

        if request.current_frequency <= 0:
            raise HTTPException(
                status_code=400,
                detail="Current frequency must be greater than 0.",
            )

        station = (
            db.query(Station)
            .filter(
                Station.station_name == request.station_name
            )
            .first()
        )

        if station is None:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Station '{request.station_name}' "
                    "not found."
                ),
            )

        occupancy = (
            db.query(Occupancy)
            .filter(
                Occupancy.station_id == station.id
            )
            .order_by(
                Occupancy.timestamp.desc()
            )
            .first()
        )

        if occupancy is None:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No occupancy data found for "
                    f"'{request.station_name}'."
                ),
            )

        if occupancy.occupancy is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Occupancy value is missing for "
                    f"'{request.station_name}'."
                ),
            )

        if occupancy.capacity is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Capacity value is missing for "
                    f"'{request.station_name}'."
                ),
            )

        occupancy_value = int(
            occupancy.occupancy
        )

        capacity = int(
            occupancy.capacity
        )

        if capacity <= 0:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Invalid capacity for "
                    f"'{request.station_name}'."
                ),
            )

        if occupancy.occupancy_percentage is not None:
            occupancy_percentage = float(
                occupancy.occupancy_percentage
            )
        else:
            occupancy_percentage = (
                occupancy_value / capacity
            ) * 100

        occupancy_ratio = (
            occupancy_value / capacity
        )

        timestamp = occupancy.timestamp

        if timestamp is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Occupancy timestamp is missing for "
                    f"'{request.station_name}'."
                ),
            )

        hour = int(timestamp.hour)

        minute = int(timestamp.minute)

        day = int(timestamp.day)

        month = int(timestamp.month)

        day_of_week = int(
            timestamp.weekday()
        )

        is_weekend = int(
            day_of_week >= 5
        )

        peak_hour = int(
            (
                7 <= hour <= 10
            )
            or
            (
                17 <= hour <= 20
            )
        )

        data = {
            "occupancy": occupancy_value,
            "capacity": capacity,
            "occupancy_percentage": occupancy_percentage,
            "occupancy_ratio": occupancy_ratio,
            "hour": hour,
            "minute": minute,
            "day": day,
            "month": month,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "peak_hour": peak_hour,
        }

        X = pd.DataFrame(
            [data],
            columns=MODEL_FEATURES,
        )

        prediction = frequency_model.predict(X)

        action_code = int(
            prediction[0]
        )

        frequency_action = ACTION_MAPPING.get(
            action_code
        )

        if frequency_action is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Unknown frequency model output: "
                    f"{action_code}"
                ),
            )

        current_frequency = int(
            request.current_frequency
        )

        if frequency_action == "Increase":

            recommended_frequency = max(
                2,
                current_frequency - 2,
            )

        elif frequency_action == "Decrease":

            recommended_frequency = (
                current_frequency + 2
            )

        else:

            recommended_frequency = (
                current_frequency
            )

        if recommended_frequency < current_frequency:
            additional_trains_required = 1
        else:
            additional_trains_required = 0

        if occupancy_percentage >= 95:

            priority = "Critical"

        elif occupancy_percentage >= 85:

            priority = "High"

        elif occupancy_percentage >= 70:

            priority = "Medium"

        else:

            priority = "Low"

        action_required = (
            recommended_frequency
            != current_frequency
        )

        if recommended_frequency < current_frequency:

            interval_reduction = (
                current_frequency
                - recommended_frequency
            )

            estimated_wait_time_impact = (
                f"Approximately "
                f"{interval_reduction} minutes "
                "less between trains"
            )

        elif recommended_frequency > current_frequency:

            interval_increase = (
                recommended_frequency
                - current_frequency
            )

            estimated_wait_time_impact = (
                f"Approximately "
                f"{interval_increase} minutes "
                "longer between trains"
            )

        else:

            estimated_wait_time_impact = (
                "No change"
            )

        if frequency_action == "Increase":

            recommendation = (
                "Increase train frequency "
                f"to one train every "
                f"{recommended_frequency} minutes."
            )

            reason = (
                f"Current occupancy is "
                f"{occupancy_percentage:.2f}% "
                "of train capacity. "
                "The ML model recommends increasing "
                "train frequency to reduce crowding."
            )

        elif frequency_action == "Decrease":

            recommendation = (
                "Decrease train frequency "
                f"to one train every "
                f"{recommended_frequency} minutes."
            )

            reason = (
                f"Current occupancy is "
                f"{occupancy_percentage:.2f}% "
                "of train capacity. "
                "The ML model recommends decreasing "
                "train frequency based on the current "
                "operational pattern."
            )

        else:

            recommendation = (
                "Maintain the current "
                f"frequency of "
                f"{current_frequency} minutes."
            )

            reason = (
                f"Current occupancy is "
                f"{occupancy_percentage:.2f}% "
                "of train capacity. "
                "The ML model recommends maintaining "
                "the current frequency."
            )

        frequency_adjustment = FrequencyAdjustment(
            station_id=station.id,
            occupancy=occupancy_value,
            capacity=capacity,
            occupancy_percentage=round(
                occupancy_percentage,
                2,
            ),
            current_frequency=current_frequency,
            recommended_frequency=recommended_frequency,
            frequency_action=frequency_action,
            action_code=action_code,
            additional_trains_required=(
                additional_trains_required
            ),
            priority=priority,
            action_required=action_required,
            recommendation=recommendation,
            reason=reason,
            estimated_wait_time_impact=(
                estimated_wait_time_impact
            ),
        )

        db.add(
            frequency_adjustment
        )

        db.commit()

        db.refresh(
            frequency_adjustment
        )

        return FrequencyAdjustmentResponse(
            frequency_action=frequency_action,
            action_code=action_code,
            occupancy=occupancy_value,
            capacity=capacity,
            occupancy_percentage=round(
                occupancy_percentage,
                2,
            ),
            current_frequency=current_frequency,
            recommended_frequency=(
                recommended_frequency
            ),
            additional_trains_required=(
                additional_trains_required
            ),
            recommendation=recommendation,
            reason=reason,
            priority=priority,
            action_required=action_required,
            estimated_wait_time_impact=(
                estimated_wait_time_impact
            ),
        )