from sqlalchemy.orm import Session
from app.models.train_schedule import TrainSchedule


def create_schedule(db: Session, schedule_data):
    schedule = TrainSchedule(**schedule_data.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


def get_all_schedules(db: Session):
    return db.query(TrainSchedule).all()


def get_schedule_by_id(db: Session, schedule_id: int):
    return (
        db.query(TrainSchedule)
        .filter(TrainSchedule.schedule_id == schedule_id)
        .first()
    )