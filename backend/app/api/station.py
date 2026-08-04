from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.station import StationCreate, StationUpdate, StationResponse
from app.services.station_service import (
    fetch_all_stations,
    fetch_station_by_id,
    add_station,
    modify_station,
    remove_station,
)
from app.middleware.auth import require_roles

router = APIRouter(
    prefix="/stations",
    tags=["Stations"]
)


@router.get("/", response_model=list[StationResponse])
def get_stations(
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db),
):
    return fetch_all_stations(db)


@router.get("/{station_id}", response_model=StationResponse)
def get_station(
    station_id: int,
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db),
):
    station = fetch_station_by_id(db, station_id)

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found"
        )

    return station


@router.post("/", response_model=StationResponse, status_code=201)
def create_station_api(
    station: StationCreate,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db),
):
    return add_station(db, station)


@router.put("/{station_id}", response_model=StationResponse)
def update_station_api(
    station_id: int,
    station: StationUpdate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db),
):
    updated = modify_station(db, station_id, station)
    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Station not found"
        )
    return updated


@router.delete("/{station_id}")
def delete_station_api(
    station_id: int,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db),
):
    deleted = remove_station(db, station_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Station not found"
        )
    return {"message": "Station deleted successfully"}