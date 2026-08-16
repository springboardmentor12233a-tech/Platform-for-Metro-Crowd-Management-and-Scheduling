from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

# <-- Added the database model import -->
from app.models.ridership_prediction import RidershipPrediction

from app.schemas.ridership_prediction import (
    RidershipPredictionRequest,
    RidershipPredictionResponse,  # <-- Added the response schema import
)

from app.services.ridership_prediction import (
    RidershipPredictionService,
)


router = APIRouter()


@router.post(
    "/predict",
    response_model=RidershipPredictionResponse, # <-- Added response_model for consistency
)
def predict_ridership(
    request: RidershipPredictionRequest,
    db: Session = Depends(get_db),
):

    return RidershipPredictionService.predict_ridership(
        db=db,
        request=request,
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[RidershipPredictionResponse],
)
def get_all_ridership_predictions(
    db: Session = Depends(get_db),
):
    return (
        db.query(RidershipPrediction)
        .order_by(RidershipPrediction.prediction_time.desc())
        .limit(100)
        .all()
    )