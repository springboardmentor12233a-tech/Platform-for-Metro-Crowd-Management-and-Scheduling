from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.delay import (
    DelayCreate,
    DelayResponse,
    DelayUpdate,
)
from app.services.delay import DelayService

router = APIRouter()


@router.post(
    "/",
    response_model=DelayResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_delay(
    delay: DelayCreate,
    db: Session = Depends(get_db),
):
    return DelayService.create_delay(db, delay)


@router.get(
    "/",
    response_model=List[DelayResponse],
)
def get_all_delays(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return DelayService.get_all_delays(
        db,
        skip,
        limit,
    )


@router.get(
    "/{delay_id}",
    response_model=DelayResponse,
)
def get_delay(
    delay_id: str,
    db: Session = Depends(get_db),
):
    delay = DelayService.get_delay(
        db,
        delay_id,
    )

    if delay is None:
        raise HTTPException(
            status_code=404,
            detail="Delay record not found",
        )

    return delay


@router.put(
    "/{delay_id}",
    response_model=DelayResponse,
)
def update_delay(
    delay_id: str,
    delay: DelayUpdate,
    db: Session = Depends(get_db),
):
    updated = DelayService.update_delay(
        db,
        delay_id,
        delay,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Delay record not found",
        )

    return updated


@router.delete(
    "/{delay_id}",
    response_model=DelayResponse,
)
def delete_delay(
    delay_id: str,
    db: Session = Depends(get_db),
):
    deleted = DelayService.delete_delay(
        db,
        delay_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Delay record not found",
        )

    return deleted