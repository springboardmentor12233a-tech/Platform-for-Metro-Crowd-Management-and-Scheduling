from typing import List, Optional
from pydantic import BaseModel, Field


class CrowdPredictionRequest(BaseModel):
    hour: int = Field(..., ge=0, le=23)
    day_name: str
    month: int = Field(..., ge=1, le=12)
    is_holiday: bool
    weather: str
    from_station: str
    to_station: str
    distance_km: float
    ticket_type: str
    is_interchange: bool


class AlertResponse(BaseModel):
    status: bool
    severity: str
    type: str
    message: str


class CrowdPredictionResponse(BaseModel):
    predicted_passengers: int
    crowd_level: str
    recommendations: List[str]
    alert: AlertResponse
    congestion_status: Optional[str] = None
    scheduling_recommendation: Optional[dict] = None
    demand_forecast: Optional[List[dict]] = None