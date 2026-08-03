from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Operator" # Admin, Operator, Analyst

class UserLogin(BaseModel):
    username: EmailStr # email passed as username for OAuth compatibility
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    theme: Optional[str] = "dark" # dark, light, cyberpunk
    language: Optional[str] = "en"

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool = True
    theme: str = "dark"
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Station Schemas ---
class StationCreate(BaseModel):
    station_id: str
    name: str
    line: str
    latitude: float
    longitude: float
    platform_count: int = 2
    capacity_threshold: int = 1500
    status: str = "Green" # Green, Yellow, Orange, Red

class StationUpdate(BaseModel):
    name: Optional[str] = None
    line: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    platform_count: Optional[int] = None
    capacity_threshold: Optional[int] = None
    status: Optional[str] = None
    current_footfall: Optional[int] = None

class StationResponse(BaseModel):
    id: str
    station_id: str
    name: str
    line: str
    latitude: float
    longitude: float
    platform_count: int
    capacity_threshold: int
    current_footfall: int = 450
    status: str = "Green"

# --- Train Schemas ---
class TrainCreate(BaseModel):
    train_id: str
    name: str
    line: str
    capacity: int = 1200
    status: str = "In Service" # In Service, Delayed, Maintenance, Standby

class TrainUpdate(BaseModel):
    name: Optional[str] = None
    line: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[str] = None
    current_station_id: Optional[str] = None
    next_station_id: Optional[str] = None

class TrainResponse(BaseModel):
    id: str
    train_id: str
    name: str
    line: str
    capacity: int
    status: str
    occupancy_rate: float = 65.0
    current_station_id: Optional[str] = None
    next_station_id: Optional[str] = None

# --- Schedule Schemas ---
class ScheduleCreate(BaseModel):
    train_id: str
    route_name: str
    origin_station_id: str
    destination_station_id: str
    departure_time: str
    arrival_time: str
    platform: int = 1
    status: str = "On Time" # On Time, Delayed, Cancelled, Completed

class ScheduleUpdate(BaseModel):
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    platform: Optional[int] = None
    status: Optional[str] = None
    delay_minutes: Optional[int] = 0

class OptimizeFrequencyRequest(BaseModel):
    route_name: str
    time_window: str = "Peak Morning" # Peak Morning, Peak Evening, Off-Peak
    target_max_occupancy: float = 80.0

# --- Prediction Schemas ---
class PredictCrowdRequest(BaseModel):
    station_id: str
    hour: int = Field(..., ge=0, le=23)
    day_of_week: int = Field(..., ge=0, le=6)
    traffic_index: float = Field(0.5, ge=0.0, le=1.0)
    weather_condition: str = "Clear" # Clear, Rain, Fog
    signal_issue: int = 0

class PredictDemandRequest(BaseModel):
    station_id: str
    hour: int
    day_of_week: int
    traffic_index: float

class PredictDelayRequest(BaseModel):
    station_id: str
    weather_condition: str
    traffic_index: float
    signal_issue: int
