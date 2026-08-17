from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.services.llm_service import (
    generate_copilot_response, 
    generate_bilingual_announcement,
    generate_shift_handover_report,
    parse_natural_language_schedule
)
from app.services.dependencies import get_current_user
from app.services import traffic_reports

router = APIRouter(prefix="/copilot", tags=["AI Operational Copilot (LLM)"])


class ChatRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None


class AnnouncementRequest(BaseModel):
    station: str
    line: str
    incident_type: str
    delay_minutes: int = 0


class SchedulePromptRequest(BaseModel):
    prompt: str


@router.post("/chat")
def copilot_chat(request: ChatRequest, user=Depends(get_current_user)):
    """
    Interactive Copilot Endpoint: Accepts operator query in natural language
    and returns LLM-driven operational guidance enriched with real-time metro telemetry.
    """
    context = request.context
    if not context:
        context = {
            "busiest_stations": traffic_reports.get_busiest_stations(top_n=3),
            "peak_hour_info": traffic_reports.get_peak_hours(),
        }

    response = generate_copilot_response(query=request.query, context_data=context)
    return response


@router.post("/generate-announcement")
def create_announcement(request: AnnouncementRequest, user=Depends(get_current_user)):
    """
    Generates bilingual (English & Hindi) public announcements for metro station PA systems.
    """
    result = generate_bilingual_announcement(
        station=request.station,
        line=request.line,
        incident_type=request.incident_type,
        delay_minutes=request.delay_minutes
    )
    return result


@router.post("/shift-handover")
def create_shift_handover(user=Depends(get_current_user)):
    """
    Generates a formal Shift Handover Report summarizing shift alerts, telemetry, and incoming recommendations.
    """
    busiest = traffic_reports.get_busiest_stations(top_n=5)
    alerts_summary = [] # Fetch live alerts summary
    operator_name = getattr(user, "full_name", "Duty Operator")
    
    result = generate_shift_handover_report(
        operator_name=operator_name,
        alerts_summary=alerts_summary,
        busiest_stations=busiest
    )
    return result


@router.post("/parse-schedule")
def parse_schedule(request: SchedulePromptRequest, user=Depends(get_current_user)):
    """
    Parses a natural language scheduling prompt into a structured train schedule payload.
    """
    result = parse_natural_language_schedule(prompt_text=request.prompt)
    return result

