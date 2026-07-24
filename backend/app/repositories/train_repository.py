from sqlalchemy.orm import Session
from app.models.train import Train


def create_train(db: Session, train_data):
    train = Train(**train_data.model_dump())
    db.add(train)
    db.commit()
    db.refresh(train)
    return train


def get_all_trains(db: Session):
    return db.query(Train).all()


def get_train_by_id(db: Session, train_id: int):
    return db.query(Train).filter(Train.train_id == train_id).first()


def update_train(db: Session, train_id: int, train_data):
    train = db.query(Train).filter(Train.train_id == train_id).first()

    if not train:
        return None

    train.train_number = train_data.train_number
    train.train_name = train_data.train_name
    train.route_id = train_data.route_id
    train.capacity = train_data.capacity
    train.status = train_data.status

    db.commit()
    db.refresh(train)

    return train


def delete_train(db: Session, train_id: int):
    train = db.query(Train).filter(Train.train_id == train_id).first()

    if not train:
        return None

    db.delete(train)
    db.commit()

    return train