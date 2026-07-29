from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.repositories.trip import trip_repository
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
)


class TripService:

    @staticmethod
    def create_trip(
        db: Session,
        trip: TripCreate,
    ) -> Trip:
        return trip_repository.create(
            db=db,
            obj_in=trip,
        )

    @staticmethod
    def get_trip(
        db: Session,
        trip_id: str,
    ):
        return trip_repository.get(
            db=db,
            id=trip_id,
        )

    @staticmethod
    def get_all_trips(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return trip_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_trip(
        db: Session,
        trip_id: str,
        trip: TripUpdate,
    ):
        db_obj = trip_repository.get(
            db=db,
            id=trip_id,
        )

        if db_obj is None:
            return None

        return trip_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=trip,
        )

    @staticmethod
    def delete_trip(
        db: Session,
        trip_id: str,
    ):
        return trip_repository.remove(
            db=db,
            id=trip_id,
        )