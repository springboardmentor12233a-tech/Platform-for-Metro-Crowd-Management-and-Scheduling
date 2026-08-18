from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database import get_db

from app.models.train_schedule import TrainSchedule

from app.schemas.schedule import (
    ScheduleRequest,
    ScheduleResponse,
    TrainScheduleResponse,
)

from app.services.scheduling_service import generate_schedule


router = APIRouter(
    prefix="/schedule",
    tags=["Smart Scheduling"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
            )
        )
    ],
)


# ------------------------------------------------
# GET ALL TRAIN SCHEDULES
# ------------------------------------------------

@router.get(
    "/",
    response_model=list[TrainScheduleResponse],
)
def get_schedules(
    db: Session = Depends(get_db),
):
    schedules = (
        db.query(TrainSchedule)
        .order_by(
            TrainSchedule.departure_time.asc()
        )
        .all()
    )

    return schedules


# ------------------------------------------------
# GET SINGLE TRAIN SCHEDULE
# ------------------------------------------------

@router.get(
    "/{schedule_id}",
    response_model=TrainScheduleResponse,
)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(TrainSchedule)
        .filter(
            TrainSchedule.id == schedule_id
        )
        .first()
    )

    if not schedule:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Schedule not found",
        )

    return schedule


# ------------------------------------------------
# AI SCHEDULE RECOMMENDATION
# ------------------------------------------------

@router.post(
    "/recommend",
    response_model=ScheduleResponse,
)
def recommend_schedule(
    request: ScheduleRequest,
):
    return generate_schedule(
        request.predicted_passengers
    )