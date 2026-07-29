from sqlalchemy.orm import Session

from app.models.station import Station
from app.repositories.station import station_repository
from app.schemas.station import (
    StationCreate,
    StationUpdate,
)


class StationService:

    @staticmethod
    def create_station(
        db: Session,
        station: StationCreate,
    ) -> Station:
        return station_repository.create(
            db=db,
            obj_in=station,
        )

    @staticmethod
    def get_station(
        db: Session,
        station_id: int,
    ) -> Station | None:
        return station_repository.get(
            db=db,
            id=station_id,
        )

    @staticmethod
    def get_all_stations(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return station_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_station(
        db: Session,
        station_id: int,
        station: StationUpdate,
    ) -> Station | None:

        db_station = station_repository.get(
            db=db,
            id=station_id,
        )

        if not db_station:
            return None

        return station_repository.update(
            db=db,
            db_obj=db_station,
            obj_in=station,
        )

    @staticmethod
    def delete_station(
        db: Session,
        station_id: int,
    ) -> Station | None:

        return station_repository.remove(
            db=db,
            id=station_id,
        )