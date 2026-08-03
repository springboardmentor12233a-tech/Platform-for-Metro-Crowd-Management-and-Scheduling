from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.permissions import require_roles
from app.services.history_service import get_prediction_history

router = APIRouter(
    prefix="/history",
    tags=["Prediction History"],
    dependencies=[
        Depends(require_roles("Admin", "Analyst"))
    ],
)


@router.get("/")
def history(db: Session = Depends(get_db)):
    return get_prediction_history(db)