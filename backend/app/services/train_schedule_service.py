from sqlalchemy.orm import Session
from app.repositories import train_schedule_repository


def create_schedule(db: Session, schedule_data):
    return train_schedule_repository.create_schedule(db, schedule_data)


def get_all_schedules(db: Session):
    return train_schedule_repository.get_all_schedules(db)


def get_schedule_by_id(db: Session, schedule_id: int):
    return train_schedule_repository.get_schedule_by_id(db, schedule_id)