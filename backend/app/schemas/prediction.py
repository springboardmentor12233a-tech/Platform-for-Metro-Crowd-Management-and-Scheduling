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


class CrowdPredictionResponse(BaseModel):
    predicted_passengers: int
    crowd_level: str