from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_roles
from app.database import get_db
from app.models import User
from app.schemas import FrequencyRecommendation, OperationalMonitoring, ScheduleUpdateRequest, TrainScheduleOut
from app.services.scheduling_service import (
    get_frequency_recommendations,
    get_operational_monitoring,
    get_train_schedules,
    update_train_delay,
)

router = APIRouter(prefix="/scheduling", tags=["Milestone 2 - Scheduling"])


@router.get("/schedules", response_model=list[TrainScheduleOut])
def schedules(
    line: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_train_schedules(db, line=line)


@router.patch("/schedules/{schedule_id}", response_model=TrainScheduleOut)
def update_schedule(
    schedule_id: int,
    payload: ScheduleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    schedule = update_train_delay(db, schedule_id, payload.delay_minutes, payload.status)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.get("/frequency-recommendations", response_model=list[FrequencyRecommendation])
def frequency_recommendations(
    limit: int = Query(default=8, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_frequency_recommendations(db, limit=limit)


@router.get("/operational-monitoring", response_model=OperationalMonitoring)
def operational_monitoring(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_operational_monitoring(db)
