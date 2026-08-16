from pathlib import Path
from datetime import datetime
import uuid

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from app.schemas.train_schedule_optimizer import (
    TrainScheduleOptimizationRequest,
    TrainScheduleOptimizationResponse,
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

from app.schemas.delay_prediction import (
    DelayPredictionRequest,
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

from app.services.delay_prediction import (
    DelayPredictionService,
)

from app.models.schedule_prediction import (
    SchedulePrediction,
)

from app.models.station import (
    Station,
)


# =========================================================
# Base Directory
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[2]


# =========================================================
# ML Model
# =========================================================

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "schedule_xgboost.pkl"
)

schedule_model = joblib.load(MODEL_PATH)


# =========================================================
# Dataset Paths
# =========================================================

SCHEDULE_FILE = (
    BASE_DIR
    / "datasets"
    / "schedules_preprocessed.csv"
)

TRIPS_FILE = (
    BASE_DIR
    / "datasets"
    / "trips_preprocessed.csv"
)

TRAINS_FILE = (
    BASE_DIR
    / "datasets"
    / "trains_preprocessed.csv"
)


# =========================================================
# Load Datasets
# =========================================================

SCHEDULE_DF = pd.read_csv(
    SCHEDULE_FILE
)

TRIPS_DF = pd.read_csv(
    TRIPS_FILE
)

TRAINS_DF = pd.read_csv(
    TRAINS_FILE
)


# =========================================================
# Model Features
# =========================================================

MODEL_FEATURES = [
    "distance_km",
    "average_speed_kmh",
    "trip_duration_min",
    "speed_efficiency",
    "departure_hour",
    "departure_minute",
    "departure_minute_of_day",
    "day",
    "day_of_week",
    "month",
    "is_weekend",
    "peak_hour",
]


# =========================================================
# Train Schedule Optimizer Service
# =========================================================

class TrainScheduleOptimizerService:

    @staticmethod
    def optimize(
        db: Session,
        request: TrainScheduleOptimizationRequest,
    ):

        # =================================================
        # Station
        # =================================================

        station_name = request.station_name.strip()

        station = (
            db.query(Station)
            .filter(
                Station.station_name
                == station_name
            )
            .first()
        )

        if station is None:

            raise ValueError(
                f"Station '{station_name}' "
                "not found in database."
            )

        # =================================================
        # Find Schedule
        # =================================================

        station_schedule = SCHEDULE_DF[
            SCHEDULE_DF["station_name"]
            .astype(str)
            .str.strip()
            == station_name
        ]

        if station_schedule.empty:

            raise ValueError(
                f"Station '{station_name}' "
                "not found in schedules."
            )

        current_schedule = (
            station_schedule.iloc[0]
        )

        # =================================================
        # Train Information
        # =================================================

        train_id = str(
            current_schedule["train_id"]
        )

        current_platform = int(
            current_schedule["platform"]
        )

        current_departure_time = str(
            current_schedule["departure_time"]
        )

        # =================================================
        # Parse Departure Time
        # =================================================

        try:

            parsed_departure = pd.to_datetime(
                current_departure_time
            )

        except Exception as exc:

            raise ValueError(
                f"Invalid departure time "
                f"'{current_departure_time}'."
            ) from exc

        schedule_hour = int(
            parsed_departure.hour
        )

        schedule_minute = int(
            parsed_departure.minute
        )

        departure_minute_of_day = (
            schedule_hour * 60
            + schedule_minute
        )

        # =================================================
        # Find Trip Information
        # =================================================

        train_trips = TRIPS_DF[
            TRIPS_DF["train_id"]
            .astype(str)
            .str.strip()
            == train_id
        ]

        if not train_trips.empty:

            trip = train_trips.iloc[0]

        else:

            station_trips = TRIPS_DF[
                (
                    TRIPS_DF["origin_station"]
                    .astype(str)
                    .str.strip()
                    == station_name
                )
                |
                (
                    TRIPS_DF["destination_station"]
                    .astype(str)
                    .str.strip()
                    == station_name
                )
            ]

            if station_trips.empty:

                raise ValueError(
                    f"No trip information found "
                    f"for train '{train_id}' "
                    f"or station '{station_name}'."
                )

            trip = station_trips.iloc[0]

        # =================================================
        # Trip Information
        # =================================================

        distance_km = float(
            trip["distance_km"]
        )

        average_speed_kmh = float(
            trip["average_speed_kmh"]
        )

        trip_duration_min = float(
            trip["trip_duration_min"]
        )

        if trip_duration_min <= 0:

            raise ValueError(
                "Trip duration must be "
                "greater than zero."
            )

        if distance_km <= 0:

            raise ValueError(
                "Distance must be "
                "greater than zero."
            )

        # =================================================
        # Date Information
        # =================================================

        day = int(
            request.day
        )

        month = int(
            request.month
        )

        is_weekend = int(
            request.weekend
        )

        # =================================================
        # Calculate Day Of Week
        # =================================================

        try:

            date_value = pd.Timestamp(
                year=2026,
                month=month,
                day=day,
            )

            day_of_week = int(
                date_value.dayofweek
            )

        except Exception:

            day_of_week = (
                5
                if is_weekend
                else 2
            )

        # =================================================
        # Peak Hour
        # =================================================

        peak_hour = int(
            (
                7 <= schedule_hour <= 10
            )
            or
            (
                17 <= schedule_hour <= 20
            )
        )

        # =================================================
        # Speed Efficiency
        # =================================================

        speed_efficiency = (
            distance_km
            / trip_duration_min
        )

        # =================================================
        # Prepare Schedule Model Input
        # =================================================

        X = pd.DataFrame(
            [
                {
                    "distance_km": distance_km,

                    "average_speed_kmh":
                        average_speed_kmh,

                    "trip_duration_min":
                        trip_duration_min,

                    "speed_efficiency":
                        speed_efficiency,

                    "departure_hour":
                        schedule_hour,

                    "departure_minute":
                        schedule_minute,

                    "departure_minute_of_day":
                        departure_minute_of_day,

                    "day":
                        day,

                    "day_of_week":
                        day_of_week,

                    "month":
                        month,

                    "is_weekend":
                        is_weekend,

                    "peak_hour":
                        peak_hour,
                }
            ]
        )

        X = X[
            MODEL_FEATURES
        ]

        # =================================================
        # Schedule ML Prediction
        # =================================================

        prediction = int(
            schedule_model.predict(X)[0]
        )

        # =================================================
        # Action Mapping
        # =================================================

        action_mapping = {

            0: "Maintain",

            1: "Shift Earlier",

            2: "Shift Later",
        }

        schedule_action = (
            action_mapping.get(
                prediction,
                "Maintain",
            )
        )

        # =================================================
        # Current Schedule Time
        # =================================================

        current_minutes = (
            schedule_hour * 60
            + schedule_minute
        )

        # =================================================
        # Recommended Departure Time
        # =================================================

        if schedule_action == "Shift Earlier":

            recommended_minutes = max(
                0,
                current_minutes - 5,
            )

        elif schedule_action == "Shift Later":

            recommended_minutes = min(
                1439,
                current_minutes + 5,
            )

        else:

            recommended_minutes = (
                current_minutes
            )

        recommended_hour = (
            recommended_minutes // 60
        )

        recommended_minute = (
            recommended_minutes % 60
        )

        recommended_departure_time = (
            f"{recommended_hour:02d}:"
            f"{recommended_minute:02d}:00"
        )

        # =================================================
        # Platform Recommendation
        # =================================================

        recommended_platform = (
            current_platform
        )

        # =================================================
        # 1. RIDERSHIP PREDICTION
        # =================================================

        ridership = (
            RidershipPredictionService
            .predict_ridership(
                db=db,
                request=(
                    RidershipPredictionRequest(
                        station_name=station_name,

                        hour=schedule_hour,

                        day=day,

                        month=month,

                        day_of_week=day_of_week,

                        weekend=(
                            is_weekend == 1
                        ),
                    )
                ),
            )
        )

        predicted_entries = int(
            ridership.predicted_entry_count
        )

        predicted_exits = int(
            ridership.predicted_exit_count
        )

        predicted_passengers = (
            predicted_entries
            + predicted_exits
        )

        # =================================================
        # 2. CROWD PREDICTION
        # =================================================

        crowd = (
            CrowdPredictionService
            .predict_crowd(
                db=db,
                request=(
                    CrowdPredictionRequest(
                        station_name=station_name,

                        entry_count=(
                            predicted_entries
                        ),

                        exit_count=(
                            predicted_exits
                        ),

                        hour=schedule_hour,

                        day=day,

                        month=month,

                        day_of_week=day_of_week,

                        weekend=(
                            is_weekend == 1
                        ),
                    )
                ),
            )
        )

        crowd_level = (
            crowd.predicted_crowd_level
        )

        # =================================================
        # 3. FREQUENCY ADJUSTMENT
        # =================================================

        current_frequency = 8

        frequency = (
            FrequencyAdjustmentService
            .recommend(
                db=db,
                request=(
                    FrequencyAdjustmentRequest(
                        station_name=station_name,

                        current_frequency=(
                            current_frequency
                        ),
                    )
                ),
            )
        )

        recommended_frequency = int(
            frequency.recommended_frequency
        )

        # =================================================
        # 4. DELAY PREDICTION
        # =================================================

        scheduled_departure_min = (
            current_minutes
        )

        scheduled_arrival_min = min(
            1439,
            current_minutes
            + int(
                round(
                    trip_duration_min
                )
            ),
        )

        # =================================================
        # Traffic
        # =================================================

        if peak_hour:

            traffic_congestion_index = 65.0

        else:

            traffic_congestion_index = 40.0

        traffic_severity = (

            0.0
            if traffic_congestion_index < 25

            else 1.0
            if traffic_congestion_index < 50

            else 2.0
            if traffic_congestion_index < 75

            else 3.0
        )

        # =================================================
        # Weather
        # =================================================

        weather_condition = "Clear"

        temperature_c = 28.0

        humidity_percent = 65.0

        wind_speed_kmh = 10.0

        precipitation_mm = 0.0

        weather_severity = (
            precipitation_mm
            + wind_speed_kmh
        )

        is_extreme_weather = int(
            precipitation_mm > 20
            or wind_speed_kmh > 35
        )

        # =================================================
        # Event
        # =================================================

        event_type = "None"

        event_attendance_est = 0

        event_severity = 0.0

        event_impact = 0.0

        # =================================================
        # Traffic + Weather Score
        # =================================================

        traffic_weather_score = (
            traffic_congestion_index
            * (
                1
                + precipitation_mm / 10
            )
        )

        # =================================================
        # Rush Hour Score
        # =================================================

        rush_hour_score = (
            traffic_congestion_index
            * peak_hour
        )

        # =================================================
        # Delay Request
        # =================================================

        delay_request = (
            DelayPredictionRequest(

                transport_type="Metro",

                route_id="Route_1",

                origin_station=station_name,

                destination_station=station_name,

                scheduled_departure_min=(
                    scheduled_departure_min
                ),

                scheduled_arrival_min=(
                    scheduled_arrival_min
                ),

                travel_duration=float(
                    trip_duration_min
                ),

                departure_hour=schedule_hour,

                weather_condition=(
                    weather_condition
                ),

                temperature_c=(
                    temperature_c
                ),

                humidity_percent=(
                    humidity_percent
                ),

                wind_speed_kmh=(
                    wind_speed_kmh
                ),

                precipitation_mm=(
                    precipitation_mm
                ),

                weather_severity=(
                    weather_severity
                ),

                event_type=(
                    event_type
                ),

                event_attendance_est=(
                    event_attendance_est
                ),

                event_severity=(
                    event_severity
                ),

                event_impact=(
                    event_impact
                ),

                traffic_congestion_index=(
                    traffic_congestion_index
                ),

                traffic_severity=(
                    traffic_severity
                ),

                traffic_weather_score=(
                    traffic_weather_score
                ),

                rush_hour_score=(
                    rush_hour_score
                ),

                holiday=0,

                peak_hour=peak_hour,

                weekday=day_of_week,

                season="Summer",

                month=month,

                day_of_week=day_of_week,

                is_weekend=is_weekend,

                is_extreme_weather=(
                    is_extreme_weather
                ),
            )
        )

        delay_prediction = (
            DelayPredictionService.predict(
                db=db,
                request=delay_request,
            )
        )

        # =================================================
        # Extract Delay Result
        # =================================================

        if isinstance(
            delay_prediction,
            dict,
        ):

            delay_minutes = int(
                delay_prediction.get(
                    "predicted_delay_minutes",
                    0,
                )
            )

            delay_severity = str(
                delay_prediction.get(
                    "delay_level",
                    "Unknown",
                )
            )

        else:

            delay_minutes = int(
                getattr(
                    delay_prediction,
                    "predicted_delay_minutes",
                    0,
                )
            )

            delay_severity = str(
                getattr(
                    delay_prediction,
                    "delay_level",
                    "Unknown",
                )
            )

        # =================================================
        # Train Allocation
        # =================================================

        idle_trains = TRAINS_DF[
            TRAINS_DF["status"]
            .astype(str)
            .str.lower()
            == "idle"
        ]

        if not idle_trains.empty:

            if "train_number" in (
                idle_trains.columns
            ):

                train_to_allocate = str(
                    idle_trains.iloc[0][
                        "train_number"
                    ]
                )

            else:

                train_to_allocate = str(
                    idle_trains.iloc[0][
                        "id"
                    ]
                )

        else:

            train_to_allocate = train_id

        # =================================================
        # Reschedule Requirement
        # =================================================

        reschedule_required = (
            schedule_action
            != "Maintain"
            or
            delay_minutes >= 5
        )

        # =================================================
        # Recommendation
        # =================================================

        if schedule_action == "Shift Earlier":

            recommendation = (
                "Shift the train schedule "
                "earlier to "
                f"{recommended_departure_time}."
            )

            reason = (
                "The schedule optimizer "
                "predicts an earlier departure "
                "is suitable for the current "
                "operational pattern."
            )

        elif schedule_action == "Shift Later":

            recommendation = (
                "Shift the train schedule "
                "later to "
                f"{recommended_departure_time}."
            )

            reason = (
                "The schedule optimizer "
                "predicts a later departure "
                "is suitable for the current "
                "operational pattern."
            )

        else:

            recommendation = (
                "Maintain the current "
                "train schedule."
            )

            reason = (
                "The schedule optimizer "
                "predicts that the current "
                "schedule is suitable."
            )

        # =================================================
        # Final Reason
        # =================================================

        final_reason = (
            f"ML Schedule Action: "
            f"{schedule_action}. "
            f"{reason} "
            f"Predicted passenger flow: "
            f"{predicted_passengers}. "
            f"Crowd level: "
            f"{crowd_level}. "
            f"Predicted delay: "
            f"{delay_minutes} minutes "
            f"({delay_severity})."
        )

        # =================================================
        # SAVE SCHEDULE PREDICTION
        # =================================================

        prediction_id = (
            "SP_"
            + uuid.uuid4()
            .hex[:12]
            .upper()
        )

        db_prediction = SchedulePrediction(

            id=prediction_id,

            station_id=int(
                station.id
            ),

            prediction_time=datetime.now(),

            train_id=str(
                train_id
            ),

            schedule_action=str(
                schedule_action
            ),

            action_code=int(
                prediction
            ),

            reschedule_required=bool(
                reschedule_required
            ),

            current_departure_time=str(
                current_departure_time
            ),

            recommended_departure_time=str(
                recommended_departure_time
            ),

            current_platform=int(
                current_platform
            ),

            recommended_platform=int(
                recommended_platform
            ),

            predicted_passengers=int(
                predicted_passengers
            ),

            crowd_level=crowd_level,

            current_frequency=int(
                current_frequency
            ),

            recommended_frequency=int(
                recommended_frequency
            ),

            delay_minutes=int(
                delay_minutes
            ),

            train_to_allocate=(
                str(train_to_allocate)
                if train_to_allocate
                else None
            ),

            recommendation=str(
                recommendation
            ),

            reason=str(
                final_reason
            ),
        )

        try:

            db.add(
                db_prediction
            )

            db.commit()

            db.refresh(
                db_prediction
            )

        except Exception:

            db.rollback()

            raise

        # =================================================
        # Return Response
        # =================================================

        return TrainScheduleOptimizationResponse(

            station_name=station_name,

            train_id=train_id,

            schedule_action=(
                schedule_action
            ),

            action_code=prediction,

            current_departure_time=(
                current_departure_time
            ),

            recommended_departure_time=(
                recommended_departure_time
            ),

            current_platform=(
                current_platform
            ),

            recommended_platform=(
                recommended_platform
            ),

            predicted_passengers=(
                predicted_passengers
            ),

            crowd_level=(
                crowd_level
            ),

            current_frequency=(
                current_frequency
            ),

            recommended_frequency=(
                recommended_frequency
            ),

            train_to_allocate=(
                train_to_allocate
            ),

            delay_minutes=(
                delay_minutes
            ),

            reschedule_required=(
                reschedule_required
            ),

            recommendation=(
                recommendation
            ),

            reason=(
                final_reason
            ),
        )