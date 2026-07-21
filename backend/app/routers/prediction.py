from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import require_roles

from app.schemas.prediction import (
    PassengerPredictionRequest,
    PassengerPredictionResponse,
)

from app.ml.prediction_service import predict_passengers
from app.services.history_service import save_prediction

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"],
)


@router.post(
    "/predict",
    response_model=PassengerPredictionResponse,
)
def predict(
    request: PassengerPredictionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):

    prediction = predict_passengers(request.model_dump())

    # Crowd Level
    if prediction < 10:
        crowd_level = "Low"
    elif prediction < 20:
        crowd_level = "Medium"
    else:
        crowd_level = "High"

    # AI Recommendation
    if crowd_level == "Low":
        recommendation = "Normal operations. No additional trains required."
    elif crowd_level == "Medium":
        recommendation = "Monitor passenger flow. Maintain current schedule."
    else:
        recommendation = (
            "Increase train frequency and deploy additional staff."
        )

    # Save prediction history
    save_prediction(
        db,
        {
            **request.model_dump(),
            "predicted_passengers": prediction,
            "crowd_level": crowd_level,
            "recommendation": recommendation,
        },
    )

    return PassengerPredictionResponse(
        predicted_passengers=prediction
    )