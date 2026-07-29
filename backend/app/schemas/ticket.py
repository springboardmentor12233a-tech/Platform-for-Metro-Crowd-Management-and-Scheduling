import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import TicketType


class TicketBase(BaseModel):
    date: Optional[datetime.date] = None

    from_station_id: int
    to_station_id: int

    distance_km: Optional[float] = None
    fare: Optional[float] = None
    cost_per_passenger: Optional[float] = None
    passengers: Optional[int] = None

    ticket_type: Optional[TicketType] = None

    remarks: Optional[str] = None

    fare_per_km: Optional[float] = None
    total_revenue: Optional[float] = None

    cost_exceeds_fare: Optional[bool] = None

    year: Optional[int] = None
    month: Optional[int] = None
    day_of_week: Optional[str] = None
    is_weekend: Optional[bool] = None

    od_pair: Optional[str] = None

    distance_km_outlier: Optional[bool] = None
    fare_outlier: Optional[bool] = None
    cost_per_passenger_outlier: Optional[bool] = None
    passengers_outlier: Optional[bool] = None


class TicketCreate(TicketBase):
    id: str


class TicketUpdate(BaseModel):
    date: Optional[datetime.date] = None

    from_station_id: Optional[int] = None
    to_station_id: Optional[int] = None

    distance_km: Optional[float] = None
    fare: Optional[float] = None
    cost_per_passenger: Optional[float] = None
    passengers: Optional[int] = None

    ticket_type: Optional[TicketType] = None

    remarks: Optional[str] = None

    fare_per_km: Optional[float] = None
    total_revenue: Optional[float] = None

    cost_exceeds_fare: Optional[bool] = None

    year: Optional[int] = None
    month: Optional[int] = None
    day_of_week: Optional[str] = None
    is_weekend: Optional[bool] = None

    od_pair: Optional[str] = None

    distance_km_outlier: Optional[bool] = None
    fare_outlier: Optional[bool] = None
    cost_per_passenger_outlier: Optional[bool] = None
    passengers_outlier: Optional[bool] = None


class TicketResponse(TicketBase):
    id: str

    model_config = ConfigDict(from_attributes=True)