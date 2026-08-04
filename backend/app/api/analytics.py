from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any

from app.database.postgres import get_db
from app.schemas.analytics import AnalyticsSummaryResponse
from app.services.analytics_service import (
    get_analytics_summary,
    get_station_performance,
    get_route_performance,
    get_trends,
)
from app.middleware.auth import require_roles

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/summary",
    response_model=AnalyticsSummaryResponse
)
def analytics_summary(
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    return get_analytics_summary(db)


@router.get("/station-performance", response_model=List[Any])
def station_performance(
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """
    Get top stations by passenger flow.
    """
    return get_station_performance(db)


@router.get("/route-performance", response_model=List[Any])
def route_performance(
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """
    Get passenger flow aggregated by route.
    """
    return get_route_performance(db)


@router.get("/trends", response_model=List[Any])
def ridership_trends(
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    """
    Get ridership flow daily trends.
    """
    return get_trends(db)