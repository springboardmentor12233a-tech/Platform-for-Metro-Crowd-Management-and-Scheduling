from fastapi import APIRouter

from app.api.v1.endpoints import train

api_router = APIRouter()

api_router.include_router(train.router)