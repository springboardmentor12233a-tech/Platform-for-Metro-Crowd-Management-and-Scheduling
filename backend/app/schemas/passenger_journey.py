import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PassengerJourneyBase(BaseModel):
    entry_station_id: int
    entry_time: Optional[datetime.datetime] = None
    entry_gate: Optional[str] = None

    exit_station_id: int
    exit_time: Optional[datetime.datetime] = None
    exit_gate: Optional[str] = None

    travel_duration_mins: Optional[int] = None


class PassengerJourneyCreate(PassengerJourneyBase):
    id: str


class PassengerJourneyUpdate(BaseModel):
    entry_station_id: Optional[int] = None
    entry_time: Optional[datetime.datetime] = None
    entry_gate: Optional[str] = None

    exit_station_id: Optional[int] = None
    exit_time: Optional[datetime.datetime] = None
    exit_gate: Optional[str] = None

    travel_duration_mins: Optional[int] = None


class PassengerJourneyResponse(PassengerJourneyBase):
    id: str

    model_config = ConfigDict(from_attributes=True)