from sqlalchemy.orm import Session
from app.repositories import passenger_data_repository


def create_passenger_data(db: Session, data):
    return passenger_data_repository.create_passenger_data(db, data)


def get_all_passenger_data(db: Session):
    return passenger_data_repository.get_all_passenger_data(db)


def get_passenger_data_by_id(db: Session, passenger_id: int):
    return passenger_data_repository.get_passenger_data_by_id(
        db,
        passenger_id
    )
