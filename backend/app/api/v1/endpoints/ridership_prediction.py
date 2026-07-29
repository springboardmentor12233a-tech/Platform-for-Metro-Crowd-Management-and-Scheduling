from fastapi import APIRouter

from app.schemas.ridership_prediction import (
    RidershipPredictionRequest,
    RidershipPredictionResponse,
)

from app.services.ridership_prediction import (
    RidershipPredictionService,
)

router = APIRouter()


@router.post(
    "/predict",
    response_model=RidershipPredictionResponse,
)
def predict_ridership(
    request: RidershipPredictionRequest,
):

    return RidershipPredictionService.predict_ridership(
        request
    )