from sqlalchemy.orm import Session
from app.repositories.station_repository import (
    get_all_stations,
    get_station_by_id,
    create_station,
    update_station,
    delete_station,
)
from app.schemas.station import StationCreate, StationUpdate


def fetch_all_stations(db: Session):
    return get_all_stations(db)


def fetch_station_by_id(db: Session, station_id: int):
    return get_station_by_id(db, station_id)


def add_station(db: Session, station: StationCreate):
    return create_station(db, station)


def modify_station(db: Session, station_id: int, station: StationUpdate):
    return update_station(db, station_id, station)


def remove_station(db: Session, station_id: int):
    return delete_station(db, station_id)