from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml.predict import predict_crowd

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
def predict(request: PredictionRequest):
    try:
        result = predict_crowd(
            request.from_station,
            request.to_station,
            request.distance,
            request.fare,
            request.ticket_type
        )

        return {
            "status": "success",
            "predicted_crowd": result
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))