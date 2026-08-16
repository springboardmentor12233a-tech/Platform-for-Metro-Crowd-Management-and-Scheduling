from fastapi import APIRouter

from app.schemas.train_location import (
    TrainLocationListResponse,
)

from app.services.train_location import (
    TrainLocationService,
)


router = APIRouter(
    prefix="/train-location",
    tags=["Train Location"],
)


@router.get(
    "/",
    response_model=TrainLocationListResponse,
)
def get_train_locations():
    return TrainLocationService.get_train_locations()