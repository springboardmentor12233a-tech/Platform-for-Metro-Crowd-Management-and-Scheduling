from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.train_status import (
    TrainStatusService
)
from app.schemas.train_status import TrainStatusResponse
router = APIRouter()


@router.get(
    "/",
    response_model=list[TrainStatusResponse],
)
def get_trains(
    db: Session = Depends(get_db),
):

    return TrainStatusService.get_all_trains(
        db
    )