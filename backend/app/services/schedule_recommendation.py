from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.schemas.schedule_recommendation import (
    ScheduleRecommendationRequest,
    ScheduleRecommendationResponse,
)

from app.schemas.ridership_prediction import (
    RidershipPredictionRequest,
)

from app.schemas.crowd_prediction import (
    CrowdPredictionRequest,
)

from app.schemas.frequency_adjustment import (
    FrequencyAdjustmentRequest,
)

from app.services.ridership_prediction import (
    RidershipPredictionService,
)

from app.services.crowd_prediction import (
    CrowdPredictionService,
)

from app.services.frequency_adjustment import (
    FrequencyAdjustmentService,
)

BASE_DIR = Path(__file__).resolve().parents[2]

SCHEDULE_DF = pd.read_csv(
    BASE_DIR / "datasets" / "schedules_preprocessed.csv"
)


class ScheduleRecommendationService:

    @staticmethod
    def recommend(
        db: Session,
        request: ScheduleRecommendationRequest,
    ):

        station_schedule = SCHEDULE_DF[
            SCHEDULE_DF["station_name"] == request.station_name
        ]

        if station_schedule.empty:

            return ScheduleRecommendationResponse(
                station_name=request.station_name,
                train_id="N/A",
                arrival_time="-",
                departure_time="-",
                platform=0,
                status="No Schedule",
                predicted_entries=0,
                predicted_exits=0,
                crowd_level="Unknown",
                current_frequency=0,
                recommended_frequency=0,
                recommended_action="No Recommendation",
                reason="No schedule available for this station.",
            )

        schedule = station_schedule.iloc[0]

        # ------------------------------------------
        # Ridership Prediction
        # ------------------------------------------

        ridership = RidershipPredictionService.predict_ridership(
            db=db,
            request=RidershipPredictionRequest(
                station_name=request.station_name,
                platform_count=1,
                concourse_count=1,
                hour=request.hour,
                day=request.day,
                month=request.month,
                day_of_week=0,
                weekend=request.weekend,
            )
        )

        predicted_entries = ridership["predicted_entry_count"]

        predicted_exits = ridership["predicted_exit_count"]

        # ------------------------------------------
        # Crowd Prediction
        # ------------------------------------------

        crowd = CrowdPredictionService.predict_crowd(
            db=db,
            request=CrowdPredictionRequest(
                station_name=request.station_name,
                entry_count=predicted_entries,
                exit_count=predicted_exits,
                platform_count=1,
                concourse_count=1,
                hour=request.hour,
                day=request.day,
                month=request.month,
                day_of_week=0,
                weekend=request.weekend,
            )
        )

        crowd_level = crowd["predicted_crowd_level"]

        # ------------------------------------------
        # Frequency Recommendation
        # ------------------------------------------

        current_frequency = 5

        frequency = FrequencyAdjustmentService.recommend(
            db=db,
            request=FrequencyAdjustmentRequest(
                station_name=request.station_name,
                platform_count=1,
                concourse_count=1,
                current_frequency=current_frequency,
                hour=request.hour,
                day=request.day,
                month=request.month,
                day_of_week=0,
                weekend=request.weekend,
            )
        )

        recommended_frequency = frequency.recommended_frequency

        # ------------------------------------------
        # AI Recommendation
        # ------------------------------------------

        total_passengers = predicted_entries + predicted_exits

        if crowd_level == "Very High":

            action = "Increase train frequency"

            reason = (
                f"Predicted {total_passengers} passengers "
                f"with {crowd_level} crowd."
            )

        elif crowd_level == "High":

            action = "Add one extra train"

            reason = (
                f"Predicted {total_passengers} passengers "
                "with High crowd."
            )

        elif crowd_level == "Medium":

            action = "Maintain current schedule"

            reason = (
                f"Predicted {total_passengers} passengers. "
                "Passenger demand is stable."
            )

        else:

            action = "Reduce train frequency"

            reason = (
                f"Predicted {total_passengers} passengers. "
                "Low passenger demand expected."
            )

        # ------------------------------------------
        # Response
        # ------------------------------------------

        return ScheduleRecommendationResponse(

            station_name=request.station_name,

            train_id=schedule["train_id"],

            arrival_time=str(schedule["arrival_time"]),

            departure_time=str(schedule["departure_time"]),

            platform=int(schedule["platform"]),

            status="Scheduled",

            predicted_entries=predicted_entries,

            predicted_exits=predicted_exits,

            crowd_level=crowd_level,

            current_frequency=current_frequency,

            recommended_frequency=recommended_frequency,

            recommended_action=action,

            reason=(
                reason
                + f" Recommended frequency: every "
                + f"{recommended_frequency} minutes."
            ),
        )