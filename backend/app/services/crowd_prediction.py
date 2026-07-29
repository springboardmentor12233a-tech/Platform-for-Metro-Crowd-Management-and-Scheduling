from sqlalchemy.orm import Session

from app.models.crowd_prediction import CrowdPrediction
from app.repositories.crowd_prediction import crowd_prediction_repository
from app.schemas.crowd_prediction import (
    CrowdPredictionCreate,
    CrowdPredictionUpdate,
)

import pandas as pd

from app.core.ml_model import (
    crowd_model,
    station_encoder,
    crowd_label_encoder,
)

from app.schemas.crowd_prediction import (
    CrowdPredictionCreate,
    CrowdPredictionUpdate,
    CrowdPredictionRequest,
)

class CrowdPredictionService:

    @staticmethod
    def create_prediction(
        db: Session,
        prediction: CrowdPredictionCreate,
    ) -> CrowdPrediction:
        return crowd_prediction_repository.create(
            db=db,
            obj_in=prediction,
        )

    @staticmethod
    def get_prediction(
        db: Session,
        prediction_id: str,
    ):
        return crowd_prediction_repository.get(
            db=db,
            id=prediction_id,
        )

    @staticmethod
    def get_all_predictions(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return crowd_prediction_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_prediction(
        db: Session,
        prediction_id: str,
        prediction: CrowdPredictionUpdate,
    ):
        db_obj = crowd_prediction_repository.get(
            db=db,
            id=prediction_id,
        )

        if db_obj is None:
            return None

        return crowd_prediction_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=prediction,
        )

    @staticmethod
    def delete_prediction(
        db: Session,
        prediction_id: str,
    ):
        return crowd_prediction_repository.remove(
            db=db,
            id=prediction_id,
        )   
    
    @staticmethod
    def predict_crowd(
        request: CrowdPredictionRequest,
    ):
        station = station_encoder.transform(
            [request.station_name]
        )[0]

        X = pd.DataFrame(
            [
                {
                    "station_name": station,
                    "entry_count": request.entry_count,
                    "exit_count": request.exit_count,
                    "platform_count": request.platform_count,
                    "concourse_count": request.concourse_count,
                    "hour": request.hour,
                    "day": request.day,
                    "month": request.month,
                    "day_of_week": request.day_of_week,
                    "weekend": request.weekend,
                }
            ]
        )

        prediction = crowd_model.predict(X)[0]

        probability = crowd_model.predict_proba(X)[0]

        confidence = float(probability.max())

        crowd_level = crowd_label_encoder.inverse_transform(
            [prediction]
        )[0]

        return {
            "predicted_crowd_level": crowd_level,
            "confidence_score": round(confidence, 4),
        }