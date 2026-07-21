from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.history_service import get_prediction_history

router = APIRouter(
    prefix="/history",
    tags=["Prediction History"],
)


@router.get("/")
def history(db: Session = Depends(get_db)):
    return get_prediction_history(db)