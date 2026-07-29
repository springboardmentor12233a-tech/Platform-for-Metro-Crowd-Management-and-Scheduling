from sqlalchemy.orm import Session

from app.models.occupancy import Occupancy
from app.repositories.occupancy import occupancy_repository
from app.schemas.occupancy import (
    OccupancyCreate,
    OccupancyUpdate,
)


class OccupancyService:

    @staticmethod
    def create_occupancy(
        db: Session,
        occupancy: OccupancyCreate,
    ) -> Occupancy:
        return occupancy_repository.create(
            db=db,
            obj_in=occupancy,
        )

    @staticmethod
    def get_occupancy(
        db: Session,
        occupancy_id: str,
    ):
        return occupancy_repository.get(
            db=db,
            id=occupancy_id,
        )

    @staticmethod
    def get_all_occupancies(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return occupancy_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_occupancy(
        db: Session,
        occupancy_id: str,
        occupancy: OccupancyUpdate,
    ):
        db_obj = occupancy_repository.get(
            db=db,
            id=occupancy_id,
        )

        if db_obj is None:
            return None

        return occupancy_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=occupancy,
        )

    @staticmethod
    def delete_occupancy(
        db: Session,
        occupancy_id: str,
    ):
        return occupancy_repository.remove(
            db=db,
            id=occupancy_id,
        )