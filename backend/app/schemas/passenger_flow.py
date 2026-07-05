from datetime import date, time

from pydantic import BaseModel


class PassengerFlowCreate(BaseModel):
    station_id: int
    flow_date: date
    flow_time: time
    passengers_in: int
    passengers_out: int
    occupancy: int


class PassengerFlowResponse(PassengerFlowCreate):
    id: int

    class Config:
        from_attributes = True