from datetime import datetime
from uuid import uuid4

import joblib
import pandas as pd

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.station import Station
from app.models.ridership_prediction import RidershipPrediction

from app.schemas.ridership_prediction import (
    RidershipPredictionRequest,
    RidershipPredictionResponse,  # <-- Imported Response Schema
)

from app.core.ml_model import (
    entry_model,    
    exit_model,
)

class RidershipPredictionService:

    @staticmethod
    def predict_ridership(
        db: Session,
        request: RidershipPredictionRequest,
    ):

        # ======================================================
        # STEP 1 — Find Station
        # ======================================================

        station = (
            db.query(Station)
            .filter(
                Station.station_name
                == request.station_name
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

        # ======================================================
        # STEP 2 — Prepare Features
        # ======================================================
        #
        # IMPORTANT:
        # Your trained ridership model uses ONLY:
        #
        # hour
        # day
        # month
        # day_of_week
        # weekend
        #
        # station_name is NOT used.
        # platform_count and concourse_count are NOT used.
        #

        X = pd.DataFrame(
            [
                {
                    "hour": request.hour,
                    "day": request.day,
                    "month": request.month,
                    "day_of_week": request.day_of_week,
                    "weekend": int(request.weekend),
                }
            ]
        )

        # ======================================================
        # STEP 3 — Predict Entry
        # ======================================================

        predicted_entry = int(
            round(
                entry_model.predict(X)[0]
            )
        )

        # ======================================================
        # STEP 4 — Predict Exit
        # ======================================================

        predicted_exit = int(
            round(
                exit_model.predict(X)[0]
            )
        )

        # Prevent negative predictions
        predicted_entry = max(
            0,
            predicted_entry,
        )

        predicted_exit = max(
            0,
            predicted_exit,
        )

        # ======================================================
        # STEP 5 — Save Prediction
        # ======================================================

        prediction_id = (
            f"RP_{uuid4().hex[:12].upper()}"
        )

        prediction_record = RidershipPrediction(

            id=prediction_id,

            station_id=station.id,

            prediction_time=datetime.now(),

            predicted_entry_count=(
                predicted_entry
            ),

            predicted_exit_count=(
                predicted_exit
            ),
        )

        try:

            db.add(
                prediction_record
            )

            db.commit()

            db.refresh(
                prediction_record
            )

        except Exception:

            db.rollback()
            raise

        # ======================================================
        # STEP 6 — Response
        # ======================================================
        
        # Now consistently returning an object instead of a dictionary
        return RidershipPredictionResponse(
            station_name=request.station_name,
            predicted_entry_count=predicted_entry,
            predicted_exit_count=predicted_exit,
        )