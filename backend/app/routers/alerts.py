from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.groq_service import generate_response
from app.ai.prompts import smart_alert_prompt

router = APIRouter(
    prefix="/alerts",
    tags=["AI Smart Alerts"]
)


class AlertRequest(BaseModel):
    station: str
    passengers: int
    capacity: int
    crowd: str


@router.post("/generate")
def generate_alert(request: AlertRequest):

    prompt = smart_alert_prompt(
        station=request.station,
        passengers=request.passengers,
        capacity=request.capacity,
        crowd=request.crowd
    )

    response = generate_response(prompt)

    return {
        "success": True,
        "station": request.station,
        "alert": response
    }