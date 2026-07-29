from app.models.passenger_journey import PassengerJourney
from app.repositories.base import CRUDBase
from app.schemas.passenger_journey import (
    PassengerJourneyCreate,
    PassengerJourneyUpdate,
)


class PassengerJourneyRepository(
    CRUDBase[
        PassengerJourney,
        PassengerJourneyCreate,
        PassengerJourneyUpdate,
    ]
):
    """Repository for Passenger Journey CRUD operations."""

    pass


passenger_journey_repository = PassengerJourneyRepository(
    PassengerJourney
)