from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.groq_service import generate_response
from app.ai.prompts import schedule_update_prompt

router = APIRouter(
    prefix="/schedule-updates",
    tags=["AI Schedule Updates"]
)


class ScheduleRequest(BaseModel):
    station: str
    line: str
    delay: int
    reason: str


@router.post("/generate")
def generate_schedule_update(request: ScheduleRequest):

    prompt = schedule_update_prompt(
        station=request.station,
        line=request.line,
        delay=request.delay,
        reason=request.reason
    )

    response = generate_response(prompt)

    return {
        "success": True,
        "station": request.station,
        "schedule_update": response
    }