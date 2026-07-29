from sqlalchemy.orm import Session

from app.repositories.delay import delay_repository
from app.schemas.delay import DelayCreate, DelayUpdate


class DelayService:

    @staticmethod
    def create_delay(db: Session, delay: DelayCreate):
        return delay_repository.create(db=db, obj_in=delay)

    @staticmethod
    def get_delay(db: Session, delay_id: str):
        return delay_repository.get(db=db, id=delay_id)

    @staticmethod
    def get_all_delays(db: Session, skip: int = 0, limit: int = 100):
        return delay_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_delay(
        db: Session,
        delay_id: str,
        delay: DelayUpdate,
    ):
        db_obj = delay_repository.get(db=db, id=delay_id)

        if db_obj is None:
            return None

        return delay_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=delay,
        )

    @staticmethod
    def delete_delay(db: Session, delay_id: str):
        return delay_repository.remove(
            db=db,
            id=delay_id,
        )