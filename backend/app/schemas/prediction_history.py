from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class PredictionHistoryResponse(BaseModel):
    prediction_id: int
    prediction_time: datetime

    from_station: str
    to_station: str

    hour: int
    day_name: str
    month: int

    weather: str
    ticket_type: str

    is_holiday: bool
    is_interchange: bool

    distance_km: float

    predicted_passengers: int
    crowd_level: str

    recommendations: str

    alert_status: bool
    alert_severity: str
    alert_type: str
    alert_message: str

    class Config:
        from_attributes = True


class PredictionHistoryListResponse(BaseModel):
    page: int
    limit: int
    total_records: int
    total_pages: int
    data: List[PredictionHistoryResponse]