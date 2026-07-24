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


class TrainScheduleResponse(TrainScheduleBase):
    schedule_id: int

    class Config:
        from_attributes = True