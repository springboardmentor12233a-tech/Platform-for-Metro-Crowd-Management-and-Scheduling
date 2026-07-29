print("LLM TEST ROUTER LOADED")
from fastapi import APIRouter
from app.services.llm_services import generate_alert

router = APIRouter(prefix="/llm", tags=["LLM Test"])


@router.get("/test")
def test_llm():

    sample_prediction = {
        "route": "Blue Line",
        "crowd_level": "High",
        "predicted_passengers": 920,
        "weather": "Rain",
        "event": "Festival"
    }

    response = generate_alert(sample_prediction)

    return response