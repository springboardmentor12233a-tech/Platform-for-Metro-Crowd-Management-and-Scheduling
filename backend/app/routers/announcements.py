from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.prompts import emergency_prompt
from app.ai.groq_service import generate_response

router = APIRouter(
    prefix="/announcements",
    tags=["AI Emergency Announcements"]
)


class AnnouncementRequest(BaseModel):

    station: str
    incident: str
    severity: str


@router.post("/generate")
def generate_announcement(request: AnnouncementRequest):

    prompt = emergency_prompt(
        request.station,
        request.incident,
        request.severity
    )

    response = generate_response(prompt)

    return {

        "success": True,

        "station": request.station,

        "incident": request.incident,

        "severity": request.severity,

        "announcement": response

    }