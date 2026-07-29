from app.models.schedules import Schedule
from app.repositories.base import CRUDBase
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
)


class ScheduleRepository(
    CRUDBase[
        Schedule,
        ScheduleCreate,
        ScheduleUpdate,
    ]
):
    """Repository for Schedule CRUD operations."""

    pass


schedule_repository = ScheduleRepository(Schedule)