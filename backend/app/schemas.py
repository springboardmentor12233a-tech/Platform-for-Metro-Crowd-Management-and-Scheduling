from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    station_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Station Schemas
class StationBase(BaseModel):
    name: str
    code: str
    capacity: int
    status: str = "Active"
    latitude: float
    longitude: float

class StationCreate(StationBase):
    pass

class StationResponse(StationBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Schedule Schemas
class ScheduleBase(BaseModel):
    train_id: str
    line_name: str
    direction: str
    departure_station_id: UUID
    arrival_station_id: UUID
    scheduled_departure: datetime
    scheduled_arrival: datetime
    actual_departure: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    status: str = "Scheduled"

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleResponse(ScheduleBase):
    id: UUID
    departure_station_name: Optional[str] = None
    arrival_station_name: Optional[str] = None

    class Config:
        from_attributes = True

# Crowd Metric Schemas
class CrowdMetricBase(BaseModel):
    station_id: UUID
    passenger_count: int
    inflow_rate: int
    outflow_rate: int
    weather: str
    is_special_event: bool
    is_holiday: bool

class CrowdMetricCreate(CrowdMetricBase):
    pass

class CrowdMetricResponse(CrowdMetricBase):
    id: UUID
    recorded_at: datetime

    class Config:
        from_attributes = True

# Alert Schemas
class AlertBase(BaseModel):
    station_id: UUID
    severity: str
    description: str
    status: str = "Active"

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: UUID
    triggered_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[UUID] = None
    station_name: Optional[str] = None

    class Config:
        from_attributes = True

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    action: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ML Forecasting Request/Response
class CrowdForecastRequest(BaseModel):
    station_code: str
    hour_of_day: int = Field(..., ge=0, le=23)
    day_of_week: int = Field(..., ge=0, le=6)
    month: int = Field(..., ge=1, le=12)
    is_holiday: bool = False
    is_special_event: bool = False
    weather: str = "Clear"
    lag_passenger_count: int

class CrowdForecastResponse(BaseModel):
    predicted_passenger_count: int
    predicted_occupancy_ratio: float
    crowd_level: str  # Low, Moderate, Busy, Overcrowded
    recommendation: str

# Schedule Recommendation Schema
class ScheduleRecommendation(BaseModel):
    hour: int
    forecasted_crowd: int
    utilization: float
    suggested_headway_minutes: int
    action_required: bool
    reason: str
