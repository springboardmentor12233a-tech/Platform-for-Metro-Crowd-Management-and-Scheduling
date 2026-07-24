from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    CrowdPredictionRequest,
    CrowdPredictionResponse
)

from app.services.prediction_service import predict_crowd

router = APIRouter(
    prefix="/predict",
    tags=["AI Prediction"]
)


@router.get("/")
def health_check():
    return {
        "message": "Prediction API is working!"
    }


@router.post(
    "/",
    response_model=CrowdPredictionResponse
)
def predict(request: CrowdPredictionRequest):
    try:
        return predict_crowd(request)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )