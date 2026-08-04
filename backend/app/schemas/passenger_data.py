from datetime import date, time
from pydantic import BaseModel, Field


class PassengerDataBase(BaseModel):
    station_id: int
    route_id: int
    train_id: int

    travel_date: date
    travel_time: time

    passenger_count: int = Field(..., ge=0)


class PassengerDataCreate(PassengerDataBase):
    pass


from typing import Optional

class PassengerDataUpdate(BaseModel):
    station_id: Optional[int] = None
    route_id: Optional[int] = None
    train_id: Optional[int] = None
    travel_date: Optional[date] = None
    travel_time: Optional[time] = None
    passenger_count: Optional[int] = Field(None, ge=0)


class PassengerDataResponse(PassengerDataBase):
    passenger_id: int
    inflow_count: int
    outflow_count: int

    class Config:
        from_attributes = True