from typing import Any

from pydantic import BaseModel, Field


class AIRequest(BaseModel):
    prompt: str = Field(
        ...,
        description="User's question or instruction for MetroFlow AI",
    )

    context: dict[str, Any] | None = Field(
        default=None,
        description="Optional dashboard context (summary, stations, alerts, revenue, etc.)",
    )


class AIResponse(BaseModel):
    response: str