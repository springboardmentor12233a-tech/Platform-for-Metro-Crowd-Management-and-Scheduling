from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MetroAlert

router = APIRouter()


@router.get("/announcements/latest")
def get_latest_announcement(db: Session = Depends(get_db)):

    latest = (
        db.query(MetroAlert)
        .order_by(MetroAlert.created_at.desc())
        .first()
    )

    if not latest:
        raise HTTPException(
            status_code=404,
            detail="No announcements found."
        )

    return {
        "id": latest.id,
        "priority": latest.priority,
        "title": latest.title,
        "message": latest.message,
        "announcement": latest.announcement,
        "recommendation": latest.recommendation,
        "passenger_advisory": latest.passenger_advisory,
        "notification_type": latest.notification_type,
        "status": latest.status,
        "created_at": latest.created_at
    }