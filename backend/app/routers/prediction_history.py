from fastapi import APIRouter, Depends

from app.auth.permissions import require_roles
from app.services.prediction_history_service import (
    get_prediction_history,
)

router = APIRouter(
    prefix="/prediction-history",
    tags=["Prediction History"],
    dependencies=[
        Depends(require_roles("Admin", "Operator", "Analyst"))
    ],
)


@router.get("/")
def history():
    return get_prediction_history()