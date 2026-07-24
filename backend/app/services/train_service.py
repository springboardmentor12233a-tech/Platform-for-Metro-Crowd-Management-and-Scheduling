from sqlalchemy.orm import Session
from app.repositories import train_repository


def create_train(db: Session, train_data):
    return train_repository.create_train(db, train_data)


def get_all_trains(db: Session):
    return train_repository.get_all_trains(db)


def get_train_by_id(db: Session, train_id: int):
    return train_repository.get_train_by_id(db, train_id)


def update_train(db: Session, train_id: int, train_data):
    return train_repository.update_train(db, train_id, train_data)


def delete_train(db: Session, train_id: int):
    return train_repository.delete_train(db, train_id)