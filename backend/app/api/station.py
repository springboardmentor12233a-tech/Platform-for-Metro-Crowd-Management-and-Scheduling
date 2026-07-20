from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.station import StationCreate, StationResponse
from app.services.station_service import (
    fetch_all_stations,
    fetch_station_by_id,
    add_station,
)

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/", response_model=list[StationResponse])
def get_stations(db: Session = Depends(get_db)):
    return fetch_all_stations(db)


@router.get("/{station_id}", response_model=StationResponse)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = fetch_station_by_id(db, station_id)

    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    return station


@router.post("/", response_model=StationResponse, status_code=201)
def create_station_api(
    station: StationCreate,
    db: Session = Depends(get_db)
):
    return add_station(db, station)