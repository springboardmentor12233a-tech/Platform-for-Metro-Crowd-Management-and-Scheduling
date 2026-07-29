from sqlalchemy.orm import Session

from app.models.schedules import Schedule
from app.repositories.schedule import schedule_repository
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
)


class ScheduleService:

    @staticmethod
    def create_schedule(
        db: Session,
        schedule: ScheduleCreate,
    ) -> Schedule:
        return schedule_repository.create(
            db=db,
            obj_in=schedule,
        )

    @staticmethod
    def get_schedule(
        db: Session,
        schedule_id: str,
    ):
        return schedule_repository.get(
            db=db,
            id=schedule_id,
        )

    @staticmethod
    def get_all_schedules(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return schedule_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_schedule(
        db: Session,
        schedule_id: str,
        schedule: ScheduleUpdate,
    ):
        db_obj = schedule_repository.get(
            db=db,
            id=schedule_id,
        )

        if db_obj is None:
            return None

        return schedule_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=schedule,
        )

    @staticmethod
    def delete_schedule(
        db: Session,
        schedule_id: str,
    ):
        return schedule_repository.remove(
            db=db,
            id=schedule_id,
        )