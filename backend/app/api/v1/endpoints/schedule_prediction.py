from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

# <-- Added the database model import -->
from app.models.schedule_prediction import SchedulePrediction

from app.schemas.schedule_prediction import (
    SchedulePredictionRequest,
    SchedulePredictionResponse,
)

from app.services.schedule_prediction import (
    SchedulePredictionService,
)


router = APIRouter()


@router.post(
    "/predict",
    response_model=SchedulePredictionResponse,
)
def predict_schedule(
    request: SchedulePredictionRequest,
):

    return SchedulePredictionService.predict(
        request
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[SchedulePredictionResponse],
)
def get_all_schedule_predictions(
    db: Session = Depends(get_db),
):
    return (
        db.query(SchedulePrediction)
        .order_by(SchedulePrediction.prediction_time.desc())
        .limit(100)
        .all()
    )