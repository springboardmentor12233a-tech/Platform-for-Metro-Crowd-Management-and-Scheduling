from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.train_schedule import (
    TrainScheduleCreate,
    TrainScheduleUpdate,
    TrainScheduleResponse,
)
from app.services import train_schedule_service
from app.middleware.auth import require_roles

router = APIRouter(
    prefix="/train-schedules",
    tags=["Train Schedules"]
)


@router.post("/", response_model=TrainScheduleResponse)
def create_schedule(
    schedule: TrainScheduleCreate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    return train_schedule_service.create_schedule(db, schedule)


@router.get("/", response_model=list[TrainScheduleResponse])
def get_all_schedules(
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    return train_schedule_service.get_all_schedules(db)


@router.get("/{schedule_id}", response_model=TrainScheduleResponse)
def get_schedule(
    schedule_id: int,
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    schedule = train_schedule_service.get_schedule_by_id(db, schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    return schedule


@router.put("/{schedule_id}", response_model=TrainScheduleResponse)
def update_schedule(
    schedule_id: int,
    schedule: TrainScheduleUpdate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    updated = train_schedule_service.update_schedule(db, schedule_id, schedule)
    if not updated:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return updated


@router.delete("/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    deleted = train_schedule_service.delete_schedule(db, schedule_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"message": "Schedule deleted successfully"}