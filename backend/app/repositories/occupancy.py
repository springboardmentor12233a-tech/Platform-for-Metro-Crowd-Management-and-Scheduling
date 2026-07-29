from app.models.occupancy import Occupancy
from app.repositories.base import CRUDBase
from app.schemas.occupancy import (
    OccupancyCreate,
    OccupancyUpdate,
)


class OccupancyRepository(
    CRUDBase[
        Occupancy,
        OccupancyCreate,
        OccupancyUpdate,
    ]
):
    """Repository for Occupancy CRUD operations."""

    pass


occupancy_repository = OccupancyRepository(Occupancy)