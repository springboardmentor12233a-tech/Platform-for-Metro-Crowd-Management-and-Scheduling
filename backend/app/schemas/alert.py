from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AlertCreate(BaseModel):
    alert_type: str = Field(..., description="Type of alert e.g. Overcrowding, Delay, Emergency, Schedule Update")
    severity: str = Field(..., description="Severity level: Info, Warning, Critical")
    message: str = Field(..., min_length=5)
    station_id: Optional[int] = None
    train_id: Optional[int] = None


class AlertResolve(BaseModel):
    resolved: bool = True


class AlertResponse(BaseModel):
    id: str
    type: str
    severity: str
    message: str
    station_id: Optional[int] = None
    train_id: Optional[int] = None
    resolved: bool
    created_at: datetime
