from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.schedule import Train, Schedule
from app.models.schemas import TrainCreate, TrainResponse, ScheduleCreate, ScheduleResponse
from app.services.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/scheduling", tags=["Scheduling"])


# ---------- Trains ----------

@router.post("/trains", response_model=TrainResponse)
def create_train(train: TrainCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.query(Train).filter(Train.train_code == train.train_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Train code already exists")

    new_train = Train(train_code=train.train_code, line=train.line, capacity=train.capacity)
    db.add(new_train)
    db.commit()
    db.refresh(new_train)
    return new_train


@router.get("/trains", response_model=List[TrainResponse])
def list_trains(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Train).all()


# ---------- Schedules ----------

@router.post("/schedules", response_model=ScheduleResponse)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    train = db.query(Train).filter(Train.id == schedule.train_id).first()
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")

    new_schedule = Schedule(**schedule.dict())
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return new_schedule


@router.get("/schedules", response_model=List[ScheduleResponse])
def list_schedules(
    line: str = None,
    period: str = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    query = db.query(Schedule).join(Train)
    if line:
        query = query.filter(Train.line == line)
    if period:
        query = query.filter(Schedule.period == period)
    return query.all()


@router.get("/schedules/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


# ---------- Frequency Adjustment ----------

@router.patch("/schedules/{schedule_id}/adjust-frequency", response_model=ScheduleResponse)
def adjust_frequency(
    schedule_id: int,
    current_density_percent: float,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    """
    Simple rule-based frequency adjustment based on current station crowd density.
    - density > 80%  -> reduce headway to 3 minutes (send trains more often)
    - density 50-80%  -> 5 minutes
    - density < 50%  -> 8 minutes
    """
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if current_density_percent > 80:
        schedule.frequency_minutes = 3
        schedule.period = "peak"
    elif current_density_percent >= 50:
        schedule.frequency_minutes = 5
        schedule.period = "peak"
    else:
        schedule.frequency_minutes = 8
        schedule.period = "off_peak"

    db.commit()
    db.refresh(schedule)
    return schedule