from datetime import datetime

from pydantic import BaseModel


class AIRecommendationCreate(BaseModel):
    station_name: str
    risk_level: str
    summary: str
    recommendation: str
    operational_action: str
    expected_impact: str
    confidence: int = 95


class AIRecommendationResponse(
    AIRecommendationCreate
):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True