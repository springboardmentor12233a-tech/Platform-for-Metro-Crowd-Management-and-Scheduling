from fastapi import APIRouter

from app.services.prediction_history_service import (
    get_prediction_history,
)

router = APIRouter(
    prefix="/prediction-history",
    tags=["Prediction History"],
)


@router.get("/")
def history():
    return get_prediction_history()