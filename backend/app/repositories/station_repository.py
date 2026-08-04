from sqlalchemy.orm import Session
from app.models.station import Station
from app.schemas.station import StationCreate, StationUpdate


def get_all_stations(db: Session):
    return db.query(Station).order_by(Station.station_name.asc()).all()


def get_station_by_id(db: Session, station_id: int):
    return (
        db.query(Station)
        .filter(Station.station_id == station_id)
        .first()
    )


def create_station(db: Session, station: StationCreate):
    db_station = Station(**station.model_dump())

    db.add(db_station)
    db.commit()
    db.refresh(db_station)

    return db_station


def update_station(db: Session, station_id: int, station_update: StationUpdate):
    db_station = get_station_by_id(db, station_id)
    if not db_station:
        return None

    update_data = station_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_station, key, value)

    db.commit()
    db.refresh(db_station)
    return db_station


def delete_station(db: Session, station_id: int):
    db_station = get_station_by_id(db, station_id)
    if not db_station:
        return None

    db.delete(db_station)
    db.commit()
    return db_station