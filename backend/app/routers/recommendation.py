from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.permissions import require_roles

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)

from app.services.gemini_service import GeminiService
from app.services.ai_history_service import (
    save_recommendation,
    get_history,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Recommendation"],
    dependencies=[
        Depends(require_roles("Admin", "Operator", "Analyst"))
    ],
)


# =====================================================
# Generate AI Recommendation
# =====================================================

@router.post(
    "/recommendation",
    response_model=RecommendationResponse,
)
async def generate_recommendation(
    data: RecommendationRequest,
    db: Session = Depends(get_db),
):

    ai_response = await GeminiService.generate_recommendation(data)

    sections = {
        "Risk Level": "",
        "Summary": "",
        "Recommendation": "",
        "Operational Action": "",
        "Expected Impact": "",
    }

    current_section = None

    for line in ai_response.splitlines():

        line = line.strip()

        if line.startswith("Risk Level:"):
            current_section = "Risk Level"
            sections[current_section] = (
                line.replace("Risk Level:", "").strip()
            )

        elif line.startswith("Summary:"):
            current_section = "Summary"
            sections[current_section] = (
                line.replace("Summary:", "").strip()
            )

        elif line.startswith("Recommendation:"):
            current_section = "Recommendation"
            sections[current_section] = (
                line.replace("Recommendation:", "").strip()
            )

        elif line.startswith("Operational Action:"):
            current_section = "Operational Action"
            sections[current_section] = (
                line.replace("Operational Action:", "").strip()
            )

        elif line.startswith("Expected Impact:"):
            current_section = "Expected Impact"
            sections[current_section] = (
                line.replace("Expected Impact:", "").strip()
            )

        elif current_section:
            sections[current_section] += " " + line

    # ==========================================
    # Save Recommendation History
    # ==========================================

    save_recommendation(
        db=db,
        station_name=data.station_name,
        risk_level=sections["Risk Level"],
        summary=sections["Summary"],
        recommendation=sections["Recommendation"],
        operational_action=sections["Operational Action"],
        expected_impact=sections["Expected Impact"],
        confidence=95,
    )

    return RecommendationResponse(
        risk_level=sections["Risk Level"],
        summary=sections["Summary"],
        recommendation=sections["Recommendation"],
        operational_action=sections["Operational Action"],
        expected_impact=sections["Expected Impact"],
    )


# =====================================================
# Recommendation History
# =====================================================

@router.get("/history")
def recommendation_history(
    db: Session = Depends(get_db),
):
    return get_history(db)