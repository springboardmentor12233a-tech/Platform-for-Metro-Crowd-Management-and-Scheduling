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


class PassengerDataResponse(PassengerDataBase):
    passenger_id: int

    class Config:
        from_attributes = True