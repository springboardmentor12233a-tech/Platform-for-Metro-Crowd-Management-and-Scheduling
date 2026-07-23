from fastapi import APIRouter
from app.api.endpoints import auth, stations, schedules, crowd, alerts, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(stations.router, prefix="/stations", tags=["Stations"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
api_router.include_router(crowd.router, prefix="/crowd", tags=["Crowd Management"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Reports"])
