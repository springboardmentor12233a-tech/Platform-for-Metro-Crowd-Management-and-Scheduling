from app.models.crowd_history import CrowdHistory
from app.repositories.base import CRUDBase
from app.schemas.crowd_history import (
    CrowdHistoryCreate,
    CrowdHistoryUpdate,
)


class CrowdHistoryRepository(
    CRUDBase[
        CrowdHistory,
        CrowdHistoryCreate,
        CrowdHistoryUpdate,
    ]
):
    """Repository for Crowd History CRUD operations."""

    pass


crowd_history_repository = CrowdHistoryRepository(CrowdHistory)