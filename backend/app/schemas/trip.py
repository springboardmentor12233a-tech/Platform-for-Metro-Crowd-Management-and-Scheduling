import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TripBase(BaseModel):
    train_id: str

    origin_station_id: int
    destination_station_id: int

    departure_time: Optional[datetime.datetime] = None
    arrival_time: Optional[datetime.datetime] = None

    trip_date: Optional[datetime.date] = None

    trip_duration_min: Optional[int] = None
    distance_km: Optional[float] = None
    average_speed_kmh: Optional[float] = None


class TripCreate(TripBase):
    id: str


class TripUpdate(BaseModel):
    train_id: Optional[str] = None

    origin_station_id: Optional[int] = None
    destination_station_id: Optional[int] = None

    departure_time: Optional[datetime.datetime] = None
    arrival_time: Optional[datetime.datetime] = None

    trip_date: Optional[datetime.date] = None

    trip_duration_min: Optional[int] = None
    distance_km: Optional[float] = None
    average_speed_kmh: Optional[float] = None


class TripResponse(TripBase):
    id: str

    model_config = ConfigDict(from_attributes=True)