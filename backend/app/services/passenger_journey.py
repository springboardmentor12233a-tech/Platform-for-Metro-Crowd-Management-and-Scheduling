from sqlalchemy.orm import Session

from app.models.passenger_journey import PassengerJourney
from app.repositories.passenger_journey import (
    passenger_journey_repository,
)
from app.schemas.passenger_journey import (
    PassengerJourneyCreate,
    PassengerJourneyUpdate,
)


class PassengerJourneyService:

    @staticmethod
    def create_passenger_journey(
        db: Session,
        journey: PassengerJourneyCreate,
    ) -> PassengerJourney:
        return passenger_journey_repository.create(
            db=db,
            obj_in=journey,
        )

    @staticmethod
    def get_passenger_journey(
        db: Session,
        journey_id: str,
    ):
        return passenger_journey_repository.get(
            db=db,
            id=journey_id,
        )

    @staticmethod
    def get_all_passenger_journeys(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return passenger_journey_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_passenger_journey(
        db: Session,
        journey_id: str,
        journey: PassengerJourneyUpdate,
    ):
        db_obj = passenger_journey_repository.get(
            db=db,
            id=journey_id,
        )

        if db_obj is None:
            return None

        return passenger_journey_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=journey,
        )

    @staticmethod
    def delete_passenger_journey(
        db: Session,
        journey_id: str,
    ):
        return passenger_journey_repository.remove(
            db=db,
            id=journey_id,
        )