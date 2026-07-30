from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.groq_service import generate_response

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)

class PromptRequest(BaseModel):
    prompt: str

@router.post("/test")
def test_ai(request: PromptRequest):
    answer = generate_response(request.prompt)

    return {
        "success": True,
        "response": answer
    }