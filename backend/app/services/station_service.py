from sqlalchemy.orm import Session

from app.models.station import Station


def create_station(db: Session, station: Station):
    db.add(station)
    db.commit()
    db.refresh(station)
    return station


def get_all_stations(db: Session):
    return db.query(Station).all()


def get_station(db: Session, station_id: int):
    return (
        db.query(Station)
        .filter(Station.id == station_id)
        .first()
    )


def update_station(db: Session, station_id: int, request):
    station = get_station(db, station_id)

    if not station:
        return None

    station.station_name = request.station_name
    station.line = request.line
    station.capacity = request.capacity

    db.commit()
    db.refresh(station)

    return station


def delete_station(db: Session, station_id: int):
    station = get_station(db, station_id)

    if not station:
        return None

    db.delete(station)
    db.commit()

    return station