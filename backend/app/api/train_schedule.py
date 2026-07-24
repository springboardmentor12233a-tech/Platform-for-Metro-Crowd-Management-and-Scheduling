from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.train_schedule import (
    TrainScheduleCreate,
    TrainScheduleResponse,
)
from app.services import train_schedule_service

router = APIRouter(
    prefix="/train-schedules",
    tags=["Train Schedules"]
)


@router.post("/", response_model=TrainScheduleResponse)
def create_schedule(
    schedule: TrainScheduleCreate,
    db: Session = Depends(get_db)
):
    return train_schedule_service.create_schedule(db, schedule)


@router.get("/", response_model=list[TrainScheduleResponse])
def get_all_schedules(db: Session = Depends(get_db)):
    return train_schedule_service.get_all_schedules(db)


@router.get("/{schedule_id}", response_model=TrainScheduleResponse)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = train_schedule_service.get_schedule_by_id(db, schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    return schedule