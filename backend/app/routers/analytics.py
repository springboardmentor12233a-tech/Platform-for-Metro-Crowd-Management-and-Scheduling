from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.prompts import analytics_prompt
from app.ai.groq_service import generate_response

router = APIRouter(
    prefix="/analytics",
    tags=["AI Analytics Dashboard"]
)

class AnalyticsRequest(BaseModel):

    station: str
    passenger_count: int
    average_wait_time: int
    alerts_generated: int
    schedule_delays: int


@router.post("/generate")
def generate_analytics(request: AnalyticsRequest):

    prompt = analytics_prompt(
        station=request.station,
        passenger_count=request.passenger_count,
        average_wait_time=request.average_wait_time,
        alerts_generated=request.alerts_generated,
        schedule_delays=request.schedule_delays
    )

    report = generate_response(prompt)

    return {
        "success": True,
        "station": request.station,
        "analytics_report": report
    }