from pathlib import Path
from datetime import datetime
import uuid

import joblib
import pandas as pd

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.station import Station
from app.models.crowd_prediction import CrowdPrediction

from app.schemas.crowd_prediction import (
    CrowdPredictionRequest,
    CrowdPredictionResponse,
)


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "crowd_xgboost.pkl"
)

model = joblib.load(MODEL_PATH)


MODEL_FEATURES = [
    "entry_count",
    "exit_count",
    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",
]


class CrowdPredictionService:

    @staticmethod
    def predict_crowd(
        db: Session,
        request: CrowdPredictionRequest,
    ):

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

        data = pd.DataFrame(
            [
                {
                    "entry_count": int(request.entry_count),
                    "exit_count": int(request.exit_count),
                    "hour": int(request.hour),
                    "day": int(request.day),
                    "month": int(request.month),
                    "day_of_week": int(request.day_of_week),
                    "weekend": int(request.weekend),
                }
            ]
        )

        data = data[MODEL_FEATURES]

        prediction = model.predict(data)

        predicted_value = prediction[0]

        if isinstance(predicted_value, str):
            predicted_crowd_level = predicted_value
        else:
            predicted_value = int(round(float(predicted_value)))

            # Map the XGBoost class index directly to the label
            class_mapping = {
                0: "Low",
                1: "Medium",
                2: "High",
                3: "Very High"
            }
            
            # Use the mapping, defaulting to "Very High" if an unknown class is returned
            predicted_crowd_level = class_mapping.get(predicted_value, "Very High")

        confidence = None

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(data)
            confidence = float(probabilities.max())

        prediction_id = (
            "CP_"
            + uuid.uuid4().hex[:12].upper()
        )

        prediction_time = datetime.now()

        db_prediction = CrowdPrediction(
            id=prediction_id,
            station_id=station.id,
            prediction_time=prediction_time,
            predicted_entries=request.entry_count,
            predicted_exits=request.exit_count,
            predicted_platform_crowd=None,
            predicted_crowd_level=predicted_crowd_level,
            confidence_score=confidence,
        )

        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)

        return CrowdPredictionResponse(
            id=db_prediction.id,
            station_id=db_prediction.station_id,
            station_name=station.station_name,
            prediction_time=db_prediction.prediction_time,
            predicted_entries=db_prediction.predicted_entries,
            predicted_exits=db_prediction.predicted_exits,
            predicted_platform_crowd=None,
            predicted_crowd_level=db_prediction.predicted_crowd_level,
            confidence_score=db_prediction.confidence_score,
        )