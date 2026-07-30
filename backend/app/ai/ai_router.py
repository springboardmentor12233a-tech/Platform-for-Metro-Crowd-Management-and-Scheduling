from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.gemini import ask_ai

router = APIRouter(prefix="/ai")


class Prompt(BaseModel):
    message: str


@router.post("/chat")
def chat(prompt: Prompt):
    answer = ask_ai(prompt.message)

    return {
        "response": answer
    }