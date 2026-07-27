from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel


# ==========================================================
# TRAIN SCHEDULE SCHEMAS
# ==========================================================

class TrainScheduleCreate(BaseModel):
    train_id: int
    route_id: int
    station_id: int
    arrival_time: time
    departure_time: time
    scheduled_date: date
    platform: Optional[str] = None
    status: str = "Scheduled"


class TrainScheduleUpdate(BaseModel):
    arrival_time: Optional[time] = None
    departure_time: Optional[time] = None
    platform: Optional[str] = None
    status: Optional[str] = None


class TrainScheduleResponse(BaseModel):
    id: int
    train_id: int
    route_id: int
    station_id: int
    arrival_time: time
    departure_time: time
    scheduled_date: date
    platform: Optional[str]
    status: str

    class Config:
        from_attributes = True


# ==========================================================
# FREQUENCY OPTIMIZATION
# ==========================================================

class FrequencyAdjustmentRequest(BaseModel):
    route_id: int
    predicted_passengers: int
    current_frequency: int


class OptimizationResponse(BaseModel):
    recommended_frequency: int
    expected_wait_time: float
    recommendation: str


# ==========================================================
# SCHEDULE ALERTS
# ==========================================================

class ScheduleAlertResponse(BaseModel):
    train_id: int
    message: str
    severity: str
    timestamp: datetime