from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import DashboardSummary, HeatmapPoint, PassengerTrendPoint, StationCrowd
from app.services.crowd_service import get_heatmap, get_passenger_trend, get_station_crowd, get_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_summary(db)


@router.get("/station-crowd", response_model=list[StationCrowd])
def station_crowd(
    target_date: date | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_station_crowd(db, target_date=target_date, limit=limit)


@router.get("/passenger-trend", response_model=list[PassengerTrendPoint])
def passenger_trend(
    days: int = Query(default=30, ge=1, le=120),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_passenger_trend(db, days=days)


@router.get("/heatmap", response_model=list[HeatmapPoint])
def heatmap(
    limit: int = Query(default=12, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_heatmap(db, limit=limit)
