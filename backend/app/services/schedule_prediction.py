from pathlib import Path
from datetime import datetime, timedelta

import joblib
import pandas as pd

from app.schemas.schedule_prediction import (
    SchedulePredictionRequest,
    SchedulePredictionResponse,
)


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "trip_duration_model.pkl"
)


# ============================================================
# Load Model
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# Service
# ============================================================

class SchedulePredictionService:

    @staticmethod
    def predict(
        request: SchedulePredictionRequest,
    ):

        # ----------------------------------------------------
        # Parse departure time
        # ----------------------------------------------------

        try:

            departure_time = datetime.strptime(
                request.scheduled_departure,
                "%H:%M:%S",
            )

        except ValueError:

            try:

                departure_time = datetime.strptime(
                    request.scheduled_departure,
                    "%H:%M",
                )

            except ValueError:

                raise ValueError(
                    "scheduled_departure must be HH:MM or HH:MM:SS"
                )


        # ----------------------------------------------------
        # Parse trip date
        # ----------------------------------------------------

        try:

            trip_date = datetime.strptime(
                request.trip_date,
                "%Y-%m-%d",
            )

        except ValueError:

            raise ValueError(
                "trip_date must be in YYYY-MM-DD format"
            )


        # ----------------------------------------------------
        # Calendar features
        #
        # These are exactly the same type of features
        # used during model training.
        # ----------------------------------------------------

        day_of_week = trip_date.weekday()

        month = trip_date.month

        is_weekend = int(
            day_of_week >= 5
        )


        # ----------------------------------------------------
        # Peak hour
        #
        # Same logic used in preprocess_trip.py
        # ----------------------------------------------------

        departure_hour = departure_time.hour

        peak_hour = int(
            (
                7 <= departure_hour <= 10
            )
            or
            (
                17 <= departure_hour <= 20
            )
        )


        # ----------------------------------------------------
        # Prepare ML input
        # ----------------------------------------------------

        data = pd.DataFrame(
            [
                {
                    "train_id":
                        request.train_id,

                    "origin_station":
                        request.origin_station,

                    "destination_station":
                        request.destination_station,

                    "distance_km":
                        request.distance_km,

                    "departure_hour":
                        departure_time.hour,

                    "departure_minute":
                        departure_time.minute,

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


        # ----------------------------------------------------
        # ML Prediction
        # ----------------------------------------------------

        prediction = model.predict(data)

        predicted_duration = float(
            prediction[0]
        )


        # ----------------------------------------------------
        # Safety constraints
        # ----------------------------------------------------

        predicted_duration = max(
            1,
            int(round(predicted_duration)),
        )


        # ----------------------------------------------------
        # Calculate predicted arrival
        # ----------------------------------------------------

        predicted_arrival_datetime = (
            departure_time
            + timedelta(
                minutes=predicted_duration
            )
        )


        predicted_arrival = (
            predicted_arrival_datetime
            .strftime("%H:%M:%S")
        )


        # ----------------------------------------------------
        # Calculate predicted average speed
        # ----------------------------------------------------

        if predicted_duration > 0:

            predicted_speed = (
                request.distance_km
                /
                (
                    predicted_duration / 60
                )
            )

        else:

            predicted_speed = 0


        predicted_speed = round(
            predicted_speed,
            2,
        )


        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return SchedulePredictionResponse(
    train_id=request.train_id,
    origin_station=request.origin_station,
    destination_station=request.destination_station,
    scheduled_departure=request.scheduled_departure,
    trip_date=request.trip_date,
    distance_km=request.distance_km,
    predicted_duration_min=predicted_duration,
    predicted_arrival=predicted_arrival,
    predicted_speed_kmh=predicted_speed,
)