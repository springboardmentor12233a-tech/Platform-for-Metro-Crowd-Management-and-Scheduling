from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import AlertOut, AnnouncementCreate, AnnouncementOut, OperationalUpdateOut
from app.services.alert_service import create_announcement, list_alerts, list_announcements, list_updates

router = APIRouter(prefix="/alerts", tags=["Milestone 3 - Alerts and Notifications"])


@router.get("", response_model=list[AlertOut])
def alerts(
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_alerts(db, active_only=active_only)


@router.get("/announcements", response_model=list[AnnouncementOut])
def announcements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_announcements(db)


@router.post("/announcements", response_model=AnnouncementOut)
def add_announcement(
    payload: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_announcement(
        db,
        title=payload.title,
        message=payload.message,
        target_station=payload.target_station,
        priority=payload.priority,
        created_by=current_user.username,
    )


@router.get("/real-time-updates", response_model=list[OperationalUpdateOut])
def real_time_updates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_updates(db)
