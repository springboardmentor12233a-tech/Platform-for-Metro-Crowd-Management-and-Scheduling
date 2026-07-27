from fastapi import APIRouter
from backend.services.gemini_service import (
    get_ai_recommendation,
    get_ai_chat_response
)

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Endpoint 1: Get AI recommendations for a station
@router.post("/recommendation")
async def recommendation(station: str, predicted_passengers: int, peak_hour: bool):
    """Get AI recommendations for a specific station"""
    try:
        recommendation = get_ai_recommendation(station, predicted_passengers, peak_hour)
        return {
            "status": "success",
            "recommendation": recommendation
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Endpoint 2: Chat with AI assistant
@router.post("/chat")
async def chat(question: str):
    """Ask MetroFlow AI Assistant a question"""
    try:
        response = get_ai_chat_response(question)
        return {
            "status": "success",
            "answer": response
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }