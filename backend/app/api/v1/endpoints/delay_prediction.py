from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

# <-- Added the database model import -->
from app.models.delay import Delay

from app.schemas.delay_prediction import (
    DelayPredictionRequest,
    DelayPredictionResponse,
)

from app.services.delay_prediction import (
    DelayPredictionService,
)


router = APIRouter()


@router.post(
    "/predict",
    response_model=DelayPredictionResponse,
)
def predict_delay(
    request: DelayPredictionRequest,
    db: Session = Depends(get_db),
):

    return DelayPredictionService.predict(
        db=db,
        request=request,
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[DelayPredictionResponse],
)
def get_all_delay_predictions(
    db: Session = Depends(get_db),
):
    # Fetch historical delays
    historical_delays = (
        db.query(Delay)
        .order_by(Delay.created_at.desc())
        .limit(100)
        .all()
    )

    formatted_responses = []

    for d in historical_delays:
        # Safely get the delay minutes, defaulting to 0 if null
        delay_mins = float(d.actual_arrival_delay_min or 0.0)
        
        # Estimate a level based on the historical minutes
        if delay_mins >= 15:
            level = "Severe"
        elif delay_mins >= 5:
            level = "Moderate"
        else:
            level = "Low"

        # Create the exact object Pydantic wants
        formatted_responses.append(
            DelayPredictionResponse(
                prediction_id=d.id,
                predicted_delay_minutes=delay_mins,
                delay_level=level,
                confidence_score=100.0, # 100% confidence because it's a historical fact
                recommendation="Review historical operational data.",
                reason=f"Historical record showing {delay_mins} minutes of delay."
            )
        )

    return formatted_responses