from pydantic import BaseModel
from datetime import datetime


class AlertResponse(BaseModel):
    station: str
    predicted_passengers: int
    severity: str
    recommendation: str
    created_at: datetime