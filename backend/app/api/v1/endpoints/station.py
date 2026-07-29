from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.station import (
    StationCreate,
    StationUpdate,
    StationResponse,
)
from app.services.station import StationService

router = APIRouter()


@router.post(
    "/",
    response_model=StationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_station(
    station: StationCreate,
    db: Session = Depends(get_db),
):
    return StationService.create_station(
        db=db,
        station=station,
    )


@router.get(
    "/",
    response_model=List[StationResponse],
)
def get_all_stations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return StationService.get_all_stations(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{station_id}",
    response_model=StationResponse,
)
def get_station(
    station_id: int,
    db: Session = Depends(get_db),
):
    station = StationService.get_station(
        db=db,
        station_id=station_id,
    )

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


@router.put(
    "/{station_id}",
    response_model=StationResponse,
)
def update_station(
    station_id: int,
    station: StationUpdate,
    db: Session = Depends(get_db),
):
    updated_station = StationService.update_station(
        db=db,
        station_id=station_id,
        station=station,
    )

    if not updated_station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return updated_station


@router.delete(
    "/{station_id}",
    response_model=StationResponse,
)
def delete_station(
    station_id: int,
    db: Session = Depends(get_db),
):
    deleted_station = StationService.delete_station(
        db=db,
        station_id=station_id,
    )

    if not deleted_station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return deleted_station