from sqlalchemy.orm import Session
from app.models.passenger_data import PassengerData


def create_passenger_data(db: Session, data):
    passenger = PassengerData(**data.model_dump())

    db.add(passenger)
    db.commit()
    db.refresh(passenger)

    return passenger


def get_all_passenger_data(db: Session):
    return db.query(PassengerData).all()


def get_passenger_data_by_id(db: Session, passenger_id: int):
    return (
        db.query(PassengerData)
        .filter(PassengerData.passenger_id == passenger_id)
        .first()
    )