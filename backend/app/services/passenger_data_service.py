from sqlalchemy.orm import Session
from app.repositories import passenger_data_repository


def create_passenger_data(db: Session, data):
    return passenger_data_repository.create_passenger_data(db, data)


def get_all_passenger_data(
    db: Session,
    station_id=None,
    route_id=None,
    start_date=None,
    end_date=None,
    page=1,
    limit=100
):
    return passenger_data_repository.get_all_passenger_data(
        db, station_id, route_id, start_date, end_date, page, limit
    )


def get_passenger_data_by_id(db: Session, passenger_id: int):
    return passenger_data_repository.get_passenger_data_by_id(
        db,
        passenger_id
    )


def update_passenger_data(db: Session, passenger_id: int, data):
    return passenger_data_repository.update_passenger_data(db, passenger_id, data)


def delete_passenger_data(db: Session, passenger_id: int):
    return passenger_data_repository.delete_passenger_data(db, passenger_id)
