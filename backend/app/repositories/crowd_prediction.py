from app.models.crowd_prediction import CrowdPrediction
from app.repositories.base import CRUDBase
from app.schemas.crowd_prediction import (
    CrowdPredictionCreate,
    CrowdPredictionUpdate,
)


class CrowdPredictionRepository(
    CRUDBase[
        CrowdPrediction,
        CrowdPredictionCreate,
        CrowdPredictionUpdate,
    ]
):
    """Repository for Crowd Prediction CRUD operations."""

    pass


crowd_prediction_repository = CrowdPredictionRepository(CrowdPrediction)