from sqlalchemy.orm import Session
from app.models.passenger_data import PassengerData


def create_passenger_data(db: Session, data):
    passenger = PassengerData(**data.model_dump())

    db.add(passenger)
    db.commit()
    db.refresh(passenger)

    return passenger


def get_all_passenger_data(
    db: Session,
    station_id=None,
    route_id=None,
    start_date=None,
    end_date=None,
    page=1,
    limit=100
):
    query = db.query(PassengerData)
    if station_id:
        query = query.filter(PassengerData.station_id == station_id)
    if route_id:
        query = query.filter(PassengerData.route_id == route_id)
    if start_date:
        query = query.filter(PassengerData.travel_date >= start_date)
    if end_date:
        query = query.filter(PassengerData.travel_date <= end_date)
        
    query = query.order_by(PassengerData.travel_date.desc(), PassengerData.travel_time.desc())
    total = query.count()
    data = query.offset((page - 1) * limit).limit(limit).all()
    return total, data


def get_passenger_data_by_id(db: Session, passenger_id: int):
    return (
        db.query(PassengerData)
        .filter(PassengerData.passenger_id == passenger_id)
        .first()
    )


def update_passenger_data(db: Session, passenger_id: int, data_update):
    db_passenger = get_passenger_data_by_id(db, passenger_id)
    if not db_passenger:
        return None
    update_data = data_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_passenger, key, value)
    db.commit()
    db.refresh(db_passenger)
    return db_passenger


def delete_passenger_data(db: Session, passenger_id: int):
    db_passenger = get_passenger_data_by_id(db, passenger_id)
    if not db_passenger:
        return None
    db.delete(db_passenger)
    db.commit()
    return db_passenger