from datetime import time
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import DayType


class ScheduleBase(BaseModel):
    train_id: str
    station_id: int
    arrival_time: Optional[time] = None
    departure_time: Optional[time] = None
    stop_sequence: Optional[int] = None
    day_type: Optional[DayType] = None
    platform: Optional[str] = None


class ScheduleCreate(ScheduleBase):
    id: str


class ScheduleUpdate(BaseModel):
    train_id: Optional[str] = None
    station_id: Optional[int] = None
    arrival_time: Optional[time] = None
    departure_time: Optional[time] = None
    stop_sequence: Optional[int] = None
    day_type: Optional[DayType] = None
    platform: Optional[str] = None


class ScheduleResponse(ScheduleBase):
    id: str

    model_config = ConfigDict(from_attributes=True)