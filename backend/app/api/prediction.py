from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.postgres import get_db

from app.schemas.prediction import (
    CrowdPredictionRequest,
    CrowdPredictionResponse
)

from app.services.prediction_service import predict_crowd
from app.services.prediction_history_service import create_prediction_history

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
def predict(
    request: CrowdPredictionRequest,
    db: Session = Depends(get_db)
):
    try:
        prediction_result = predict_crowd(request, db=db)

        create_prediction_history(
            db=db,
            request_data=request.model_dump(),
            prediction_result=prediction_result
        )

        return prediction_result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )