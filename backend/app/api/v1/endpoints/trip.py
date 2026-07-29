from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.trip import (
    TripCreate,
    TripResponse,
    TripUpdate,
)
from app.services.trip import TripService

router = APIRouter()


@router.post(
    "/",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
):
    return TripService.create_trip(
        db=db,
        trip=trip,
    )


@router.get(
    "/",
    response_model=List[TripResponse],
)
def get_all_trips(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return TripService.get_all_trips(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{trip_id}",
    response_model=TripResponse,
)
def get_trip(
    trip_id: str,
    db: Session = Depends(get_db),
):
    trip = TripService.get_trip(
        db=db,
        trip_id=trip_id,
    )

    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    return trip


@router.put(
    "/{trip_id}",
    response_model=TripResponse,
)
def update_trip(
    trip_id: str,
    trip: TripUpdate,
    db: Session = Depends(get_db),
):
    updated = TripService.update_trip(
        db=db,
        trip_id=trip_id,
        trip=trip,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    return updated


@router.delete(
    "/{trip_id}",
    response_model=TripResponse,
)
def delete_trip(
    trip_id: str,
    db: Session = Depends(get_db),
):
    deleted = TripService.delete_trip(
        db=db,
        trip_id=trip_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    return deleted