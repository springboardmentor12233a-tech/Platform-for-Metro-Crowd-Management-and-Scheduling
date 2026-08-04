from datetime import time
from pydantic import BaseModel


class TrainScheduleBase(BaseModel):
    route_id: int
    station_id: int
    train_id: int
    arrival_time: time
    departure_time: time
    day_type: str


class TrainScheduleCreate(TrainScheduleBase):
    pass


from typing import Optional

class TrainScheduleUpdate(BaseModel):
    route_id: Optional[int] = None
    station_id: Optional[int] = None
    train_id: Optional[int] = None
    arrival_time: Optional[time] = None
    departure_time: Optional[time] = None
    day_type: Optional[str] = None


class TrainScheduleResponse(TrainScheduleBase):
    schedule_id: int

    class Config:
        from_attributes = True