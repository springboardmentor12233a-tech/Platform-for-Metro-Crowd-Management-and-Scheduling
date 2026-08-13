from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import joblib
import os

from app.ml.predict import predict_crowd
from app.database import get_db
from app import models

router = APIRouter(
    prefix="/prediction",
    tags=["Crowd Prediction"]
)


class PredictionRequest(BaseModel):
    from_station: str
    to_station: str
    distance: float
    fare: float
    ticket_type: str


@router.post("/predict-crowd")
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):
    try:
        result = predict_crowd(
            request.from_station,
            request.to_station,
            request.distance,
            request.fare,
            request.ticket_type
        )

        history = models.PredictionHistory(
            station_name=request.from_station,
            passenger_count=0,
            predicted_crowd=result,
            prediction_type="Crowd Prediction",
            predicted_by="System"
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return {
            "status": "success",
            "predicted_crowd": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/stations")
def get_stations():
    try:
        base_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "ml"
        )

        encoder = joblib.load(
            os.path.join(
                base_path,
                "from_station_encoder.pkl"
            )
        )

        stations = sorted(
            list(
                set(
                    station.strip().title()
                    for station in encoder.classes_
                )
            )
        )

        return {
            "stations": stations
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )