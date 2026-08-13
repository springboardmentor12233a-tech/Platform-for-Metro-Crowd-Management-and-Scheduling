from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.auth import require_role

router = APIRouter(
    prefix="/history",
    tags=["Prediction History"]
)


@router.get("/")
def get_prediction_history(
    db: Session = Depends(get_db)
):
    history = (
        db.query(models.PredictionHistory)
        .order_by(models.PredictionHistory.created_at.desc())
        .all()
    )

    return history


@router.get("/{history_id}")
def get_prediction(
    history_id: int,
    db: Session = Depends(get_db)
):
    history = (
        db.query(models.PredictionHistory)
        .filter(models.PredictionHistory.id == history_id)
        .first()
    )

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Prediction history not found"
        )

    return history


@router.delete("/{history_id}")
def delete_prediction(
    history_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Admin"]))
):
    history = (
        db.query(models.PredictionHistory)
        .filter(models.PredictionHistory.id == history_id)
        .first()
    )

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Prediction history not found"
        )

    db.delete(history)
    db.commit()

    return {
        "message": "Prediction history deleted successfully"
    }