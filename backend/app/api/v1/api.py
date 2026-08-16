from fastapi import APIRouter

from app.api.v1.endpoints import train
from app.api.v1.endpoints import frequency_adjustment


api_router = APIRouter()

api_router.include_router(train.router)
api_router.include_router(
    frequency_adjustment.router
)