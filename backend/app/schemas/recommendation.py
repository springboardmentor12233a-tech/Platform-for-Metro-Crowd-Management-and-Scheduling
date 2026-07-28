from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    station_name: str
    passenger_count: int
    station_capacity: int
    delay_minutes: int
    peak_hour: bool
    occupancy_percent: float
    revenue_today: float
    active_trains: int


class RecommendationResponse(BaseModel):
    risk_level: str
    summary: str
    recommendation: str
    operational_action: str
    expected_impact: str