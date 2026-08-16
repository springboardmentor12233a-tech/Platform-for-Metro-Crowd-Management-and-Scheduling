from pathlib import Path
from datetime import datetime
import uuid

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from app.models.delay_prediction import DelayPrediction

from app.schemas.delay_prediction import (
    DelayPredictionRequest,
    DelayPredictionResponse,
)


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "delay_xgboost.pkl"
)

model = joblib.load(MODEL_PATH)


MODEL_FEATURES = [
    "transport_type",
    "route_id",
    "scheduled_departure_min",
    "scheduled_arrival_min",
    "travel_duration",
    "departure_hour",
    "weather_condition",
    "temperature_c",
    "humidity_percent",
    "wind_speed_kmh",
    "precipitation_mm",
    "weather_severity",
    "event_type",
    "event_attendance_est",
    "event_severity",
    "event_impact",
    "traffic_congestion_index",
    "traffic_severity",
    "traffic_weather_score",
    "rush_hour_score",
    "holiday",
    "peak_hour",
    "weekday",
    "season",
    "month",
    "day_of_week",
    "is_weekend",
    "is_extreme_weather",
]


class DelayPredictionService:

    @staticmethod
    def predict(
        db: Session,
        request: DelayPredictionRequest,
    ):

        departure_hour = int(request.departure_hour)

        peak_hour = int(
            (
                7 <= departure_hour <= 10
            )
            or
            (
                17 <= departure_hour <= 20
            )
        )

        is_weekend = int(request.is_weekend)

        weekday = int(request.weekday)

        data = {
            "transport_type": str(request.transport_type),

            "route_id": str(request.route_id),

            "scheduled_departure_min": float(
                request.scheduled_departure_min
            ),

            "scheduled_arrival_min": float(
                request.scheduled_arrival_min
            ),

            "travel_duration": float(
                request.travel_duration
            ),

            "departure_hour": departure_hour,

            "weather_condition": str(
                request.weather_condition
            ),

            "temperature_c": float(
                request.temperature_c
            ),

            "humidity_percent": float(
                request.humidity_percent
            ),

            "wind_speed_kmh": float(
                request.wind_speed_kmh
            ),

            "precipitation_mm": float(
                request.precipitation_mm
            ),

            "weather_severity": float(
                request.weather_severity
            ),

            "event_type": str(
                request.event_type
            ),

            "event_attendance_est": float(
                request.event_attendance_est
            ),

            "event_severity": float(
                request.event_severity
            ),

            "event_impact": float(
                request.event_impact
            ),

            "traffic_congestion_index": float(
                request.traffic_congestion_index
            ),

            "traffic_severity": float(
                request.traffic_severity
            ),

            "traffic_weather_score": float(
                request.traffic_weather_score
            ),

            "rush_hour_score": float(
                request.rush_hour_score
            ),

            "holiday": int(
                request.holiday
            ),

            "peak_hour": peak_hour,

            "weekday": weekday,

            "season": str(
                request.season
            ),

            "month": int(
                request.month
            ),

            "day_of_week": int(
                request.day_of_week
            ),

            "is_weekend": is_weekend,

            "is_extreme_weather": int(
                request.is_extreme_weather
            ),
        }

        X = pd.DataFrame(
            [data],
            columns=MODEL_FEATURES,
        )

        prediction = model.predict(X)

        predicted_delay = float(prediction[0])

        predicted_delay = max(
            0.0,
            predicted_delay,
        )

        predicted_delay = round(
            predicted_delay,
            2,
        )

        if predicted_delay < 2:

            delay_level = "On Time"

            recommendation = (
                "Train is expected to operate on time. "
                "No schedule adjustment is required."
            )

        elif predicted_delay < 5:

            delay_level = "Minor Delay"

            recommendation = (
                "Minor delay expected. "
                "Continue monitoring the train."
            )

        elif predicted_delay < 8:

            delay_level = "Moderate Delay"

            recommendation = (
                "Moderate delay expected. "
                "Consider operational monitoring and "
                "schedule adjustment."
            )

        else:

            delay_level = "Major Delay"

            recommendation = (
                "Major delay expected. "
                "Consider rescheduling or "
                "operational intervention."
            )

        reason = (
            f"Predicted departure delay is "
            f"{predicted_delay} minutes. "
            f"Delay level: {delay_level}."
        )

        prediction_id = (
            "DP_"
            + uuid.uuid4().hex[:12].upper()
        )

        db_prediction = DelayPrediction(
            id=prediction_id,
            route_id=str(request.route_id),
            transport_type=str(request.transport_type),
            prediction_time=datetime.now(),
            scheduled_departure_min=int(
                request.scheduled_departure_min
            ),
            scheduled_arrival_min=int(
                request.scheduled_arrival_min
            ),
            predicted_delay_minutes=predicted_delay,
            delay_level=delay_level,
            confidence_score=None,
        )

        try:

            db.add(db_prediction)

            db.commit()

            db.refresh(db_prediction)

        except Exception:

            db.rollback()

            raise

        return DelayPredictionResponse(
            prediction_id=db_prediction.id,
            predicted_delay_minutes=predicted_delay,
            delay_level=delay_level,
            confidence_score=None,
            recommendation=recommendation,
            reason=reason,
        )