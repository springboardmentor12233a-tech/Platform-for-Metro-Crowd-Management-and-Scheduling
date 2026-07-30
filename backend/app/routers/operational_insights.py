from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.prompts import operational_insight_prompt
from app.ai.groq_service import generate_response

router = APIRouter(
    prefix="/operational-insights",
    tags=["AI Operational Insights"]
)


class OperationalInsightRequest(BaseModel):

    station: str
    passenger_count: int
    capacity: int
    crowd_level: str
    train_frequency: str
    average_wait_time: int


@router.post("/generate")
def generate_operational_insight(request: OperationalInsightRequest):

    prompt = operational_insight_prompt(
        station=request.station,
        passenger_count=request.passenger_count,
        capacity=request.capacity,
        crowd_level=request.crowd_level,
        train_frequency=request.train_frequency,
        average_wait_time=request.average_wait_time
    )

    response = generate_response(prompt)

    return {

        "success": True,

        "station": request.station,

        "insight": response

    }