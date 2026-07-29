from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import TrainStatus


# ==================================================
# Base Schema
# ==================================================

class TrainBase(BaseModel):
    train_number: str
    train_name: Optional[str] = None
    line: Optional[str] = None
    capacity: Optional[int] = None
    current_station_id: Optional[int] = None
    status: Optional[TrainStatus] = None
    speed_limit_kmh: Optional[float] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    year_of_manufacture: Optional[int] = None


# ==================================================
# Create Schema
# ==================================================

class TrainCreate(TrainBase):
    id: str


# ==================================================
# Update Schema
# ==================================================

class TrainUpdate(BaseModel):
    train_number: Optional[str] = None
    train_name: Optional[str] = None
    line: Optional[str] = None
    capacity: Optional[int] = None
    current_station_id: Optional[int] = None
    status: Optional[TrainStatus] = None
    speed_limit_kmh: Optional[float] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    year_of_manufacture: Optional[int] = None


# ==================================================
# Response Schema
# ==================================================

class TrainResponse(TrainBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)