from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.station import Station
from app.schemas.station import StationCreate
from app.services.station_service import (
    create_station,
    get_all_stations,
    get_station,
    update_station,
    delete_station,
)

router = APIRouter(
    prefix="/stations",
    tags=["Stations"],
)


@router.post("/")
def add_station(
    request: StationCreate,
    db: Session = Depends(get_db),
):
    station = Station(
        station_name=request.station_name,
        line=request.line,
        capacity=request.capacity,
    )

    return create_station(db, station)


@router.get("/")
def all_stations(
    db: Session = Depends(get_db),
):
    return get_all_stations(db)


@router.get("/{station_id}")
def station_by_id(
    station_id: int,
    db: Session = Depends(get_db),
):
    station = get_station(db, station_id)

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


@router.put("/{station_id}")
def edit_station(
    station_id: int,
    request: StationCreate,
    db: Session = Depends(get_db),
):
    station = update_station(
        db,
        station_id,
        request,
    )

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


@router.delete("/{station_id}")
def remove_station(
    station_id: int,
    db: Session = Depends(get_db),
):
    station = delete_station(
        db,
        station_id,
    )

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return {
        "message": "Station deleted successfully"
    }