from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from app.database.database import get_db

from app.schemas.ai import AIRequest, AIResponse
from app.schemas.ai_history import (
    AIRecommendationCreate,
    AIRecommendationResponse,
)

from app.services.gemini_service import GeminiService
from app.services.ai_history_service import (
    save_recommendation,
    get_history,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


# =====================================================
# Gemini Chat
# =====================================================

@router.post("/chat", response_model=AIResponse)
async def chat(request: AIRequest):

    context = request.context or {}

    context_text = json.dumps(
        context,
        indent=2,
        default=str,
    )

    full_prompt = f"""
You are MetroFlow AI, an intelligent Metro Operations Assistant.

You help metro operators analyze dashboard data and provide operational recommendations.

====================================================
Dashboard Context
====================================================

{context_text}

====================================================
User Question
====================================================

{request.prompt}

====================================================
Instructions
====================================================

- Use ONLY the dashboard context provided.
- Never invent passenger numbers, revenue, stations, alerts, or analytics.
- If the requested information is missing, clearly state that it is unavailable.
- Answer professionally using Markdown.
- Keep responses concise but informative.
- Use headings.
- Use bullet points where appropriate.
- Highlight important information in bold.
- When possible provide:
    1. Summary
    2. Key Insights
    3. Recommendations
    4. Conclusion
"""

    answer = await GeminiService.generate(full_prompt)

    return AIResponse(response=answer)


# =====================================================
# MetroFlow AI Recommendation
# =====================================================

@router.post("/recommendation")
async def generate_recommendation(
    request: AIRecommendationCreate,
    db: Session = Depends(get_db),
):

    prompt = f"""
You are MetroFlow AI.

Analyze the following metro operational situation.

Station:
{request.station_name}

Risk Level:
{request.risk_level}

Summary:
{request.summary}

Respond using Markdown.

Format:

# Summary

...

## Recommendations

- Recommendation 1
- Recommendation 2

## Operational Actions

- Action 1
- Action 2

## Expected Impact

- Impact 1
- Impact 2

Keep the answer practical and concise.
"""

    answer = await GeminiService.generate(prompt)

    save_recommendation(
        db=db,
        data=AIRecommendationCreate(
            station_name=request.station_name,
            risk_level=request.risk_level,
            summary=request.summary,
            recommendation=answer,
            operational_action=request.operational_action,
            expected_impact=request.expected_impact,
            confidence=request.confidence,
        ),
    )

    return {
        "station_name": request.station_name,
        "risk_level": request.risk_level,
        "summary": request.summary,
        "recommendation": answer,
        "operational_action": request.operational_action,
        "expected_impact": request.expected_impact,
        "confidence": request.confidence,
    }


# =====================================================
# Recommendation History
# =====================================================

@router.get(
    "/history",
    response_model=list[AIRecommendationResponse],
)
def recommendation_history(
    db: Session = Depends(get_db),
):

    return get_history(db)