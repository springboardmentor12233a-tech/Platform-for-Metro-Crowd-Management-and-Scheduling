from app.models.train import Train
from app.repositories.base import CRUDBase
from app.schemas.train import TrainCreate, TrainUpdate


class TrainRepository(CRUDBase[Train, TrainCreate, TrainUpdate]):
    """Repository for Train CRUD operations."""

    pass


train_repository = TrainRepository(Train)