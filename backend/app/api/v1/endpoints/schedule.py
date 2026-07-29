from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)
from app.services.schedule import ScheduleService

router = APIRouter()


@router.post(
    "/",
    response_model=ScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
):
    return ScheduleService.create_schedule(
        db=db,
        schedule=schedule,
    )


@router.get(
    "/",
    response_model=List[ScheduleResponse],
)
def get_all_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return ScheduleService.get_all_schedules(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def get_schedule(
    schedule_id: str,
    db: Session = Depends(get_db),
):
    schedule = ScheduleService.get_schedule(
        db=db,
        schedule_id=schedule_id,
    )

    if schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    return schedule


@router.put(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def update_schedule(
    schedule_id: str,
    schedule: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    updated_schedule = ScheduleService.update_schedule(
        db=db,
        schedule_id=schedule_id,
        schedule=schedule,
    )

    if updated_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    return updated_schedule


@router.delete(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def delete_schedule(
    schedule_id: str,
    db: Session = Depends(get_db),
):
    deleted_schedule = ScheduleService.delete_schedule(
        db=db,
        schedule_id=schedule_id,
    )

    if deleted_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    return deleted_schedule