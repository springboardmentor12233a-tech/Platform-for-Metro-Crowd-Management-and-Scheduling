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


def update_schedule(db: Session, schedule_id: int, schedule_update):
    db_schedule = get_schedule_by_id(db, schedule_id)
    if not db_schedule:
        return None
    update_data = schedule_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def delete_schedule(db: Session, schedule_id: int):
    db_schedule = get_schedule_by_id(db, schedule_id)
    if not db_schedule:
        return None
    db.delete(db_schedule)
    db.commit()
    return db_schedule