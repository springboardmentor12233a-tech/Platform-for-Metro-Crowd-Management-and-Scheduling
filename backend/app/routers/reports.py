from fastapi import APIRouter, Depends, Query

from app.services import traffic_reports
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/reports", tags=["Traffic Analysis Reports"])


@router.get("/traffic-summary")
def traffic_summary(top_n: int = Query(5, ge=1, le=20), user=Depends(get_current_user)):
    """
    Full traffic analysis report: busiest stations, peak hours,
    demand by line, and weekday vs weekend comparison.
    """
    return traffic_reports.get_traffic_summary(top_n=top_n)


@router.get("/busiest-stations")
def busiest_stations(top_n: int = Query(5, ge=1, le=20), user=Depends(get_current_user)):
    return {"busiest_stations": traffic_reports.get_busiest_stations(top_n=top_n)}


@router.get("/peak-hours")
def peak_hours(user=Depends(get_current_user)):
    return traffic_reports.get_peak_hours()


@router.get("/demand-by-line")
def demand_by_line(user=Depends(get_current_user)):
    return {"demand_by_line": traffic_reports.get_demand_by_line()}


@router.get("/weekday-vs-weekend")
def weekday_vs_weekend(user=Depends(get_current_user)):
    return traffic_reports.get_weekday_vs_weekend()