from sqlalchemy.orm import Session

from app.models.crowd_history import CrowdHistory
from app.repositories.crowd_history import crowd_history_repository
from app.schemas.crowd_history import (
    CrowdHistoryCreate,
    CrowdHistoryUpdate,
)


class CrowdHistoryService:

    @staticmethod
    def create_crowd_history(
        db: Session,
        crowd_history: CrowdHistoryCreate,
    ) -> CrowdHistory:
        return crowd_history_repository.create(
            db=db,
            obj_in=crowd_history,
        )

    @staticmethod
    def get_crowd_history(
        db: Session,
        history_id: str,
    ) -> CrowdHistory | None:
        return crowd_history_repository.get(
            db=db,
            id=history_id,
        )

    @staticmethod
    def get_all_crowd_history(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return crowd_history_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_crowd_history(
        db: Session,
        history_id: str,
        crowd_history: CrowdHistoryUpdate,
    ):
        db_obj = crowd_history_repository.get(
            db=db,
            id=history_id,
        )

        if not db_obj:
            return None

        return crowd_history_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=crowd_history,
        )

    @staticmethod
    def delete_crowd_history(
        db: Session,
        history_id: str,
    ):
        return crowd_history_repository.remove(
            db=db,
            id=history_id,
        )