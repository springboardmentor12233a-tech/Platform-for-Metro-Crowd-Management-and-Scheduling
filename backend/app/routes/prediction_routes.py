from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import PredictionResponse, TrafficReport
from app.services.prediction_service import get_demand_forecast, get_traffic_report

router = APIRouter(prefix="/prediction", tags=["Milestone 2 - AI Prediction"])


@router.get("/demand-forecast", response_model=PredictionResponse)
def demand_forecast(
    days: int = Query(default=7, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_demand_forecast(db, days=days)


@router.get("/traffic-report", response_model=TrafficReport)
def traffic_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_traffic_report(db)
