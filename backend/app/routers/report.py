from fastapi import APIRouter, Query

from app.services.report import generate_report

router = APIRouter(
    prefix="/reports",
    tags=["Traffic Analysis Reports"]
)


@router.get("/traffic-analysis")
def traffic_analysis(
    day_type: str = Query("Weekday")
):

    return generate_report(day_type)