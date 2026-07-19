from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "operator"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TrainCreate(BaseModel):
    train_code: str
    line: str
    capacity: int = 300

class TrainResponse(BaseModel):
    id: int
    train_code: str
    line: str
    capacity: int
    is_active: int

    class Config:
        from_attributes = True

class ScheduleCreate(BaseModel):
    train_id: int
    from_station: str
    to_station: str
    departure_time: str
    arrival_time: str
    frequency_minutes: int
    period: str = "off_peak"

class ScheduleResponse(BaseModel):
    id: int
    train_id: int
    from_station: str
    to_station: str
    departure_time: str
    arrival_time: str
    frequency_minutes: int
    period: str

    class Config:
        from_attributes = True

class AlertCreate(BaseModel):
    alert_type: str  # "overcrowding" | "delay" | "emergency" | "maintenance"
    severity: str = "medium"  # "low" | "medium" | "high" | "critical"
    station: Optional[str] = None
    message: str

class AlertResponse(BaseModel):
    id: int
    alert_type: str
    severity: str
    station: Optional[str]
    message: str
    created_by: str
    is_active: bool

    class Config:
        from_attributes = True