from sqlalchemy.orm import Session
from app.models.station import Station
from app.schemas.station import StationCreate


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