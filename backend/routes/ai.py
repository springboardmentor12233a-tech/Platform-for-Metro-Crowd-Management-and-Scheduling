from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.gemini_service import (
    get_ai_recommendation,
    get_ai_chat_response
)

router = APIRouter(prefix="/api/ai", tags=["AI"])


# ============================================================
# AI RECOMMENDATION
# ============================================================

class RecommendationRequest(BaseModel):
    station: str
    predicted_passengers: int
    peak_hour: bool


@router.post("/recommendation")
async def recommendation(data: RecommendationRequest):

    try:

        recommendation = get_ai_recommendation(
            station=data.station,
            predicted_passengers=data.predicted_passengers,
            peak_hour=data.peak_hour
        )

        return {
            "status": "success",
            "recommendation": recommendation
        }

    except Exception as e:

        return {
            "status": "error",
            "recommendation": str(e)
        }


# ============================================================
# AI CHAT ASSISTANT
# ============================================================

class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def chat(data: ChatRequest):

    try:

        response = get_ai_chat_response(data.question)

        return {
            "status": "success",
            "question": data.question,
            "answer": response
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }