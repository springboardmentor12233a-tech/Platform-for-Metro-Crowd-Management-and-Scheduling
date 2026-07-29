from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.train import Train
from app.repositories.train import train_repository
from app.schemas.train import TrainCreate, TrainUpdate


class TrainService:
    """Business logic for Train operations."""

    @staticmethod
    def get_train(db: Session, train_id: str) -> Optional[Train]:
        return train_repository.get(db=db, id=train_id)

    @staticmethod
    def get_all_trains(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Train]:
        return train_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def create_train(
        db: Session,
        train: TrainCreate,
    ) -> Train:
        return train_repository.create(
            db=db,
            obj_in=train,
        )

    @staticmethod
    def update_train(
        db: Session,
        train_id: str,
        train_update: TrainUpdate,
    ) -> Optional[Train]:

        db_train = train_repository.get(db=db, id=train_id)

        if db_train is None:
            return None

        return train_repository.update(
            db=db,
            db_obj=db_train,
            obj_in=train_update,
        )

    @staticmethod
    def delete_train(
        db: Session,
        train_id: str,
    ) -> Optional[Train]:

        db_train = train_repository.get(db=db, id=train_id)

        if db_train is None:
            return None

        return train_repository.remove(
            db=db,
            id=train_id,
        )