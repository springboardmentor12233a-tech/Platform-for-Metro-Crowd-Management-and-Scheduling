from app.models.trip import Trip
from app.repositories.base import CRUDBase
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
)


class TripRepository(
    CRUDBase[
        Trip,
        TripCreate,
        TripUpdate,
    ]
):
    pass


trip_repository = TripRepository(Trip)