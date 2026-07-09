from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class StationOut(BaseModel):
    id: int
    name: str
    line: Optional[str]
    capacity: int

    class Config:
        from_attributes = True


class SummaryCard(BaseModel):
    label: str
    value: str
    helper: str


class ChartPoint(BaseModel):
    label: str
    value: float


class DashboardSummary(BaseModel):
    total_passengers: int
    total_trips: int
    total_stations: int
    busiest_station: str
    latest_date: Optional[date]
    average_fare: float
    cards: List[SummaryCard]
    remarks_split: List[ChartPoint]
    ticket_type_split: List[ChartPoint]


class StationCrowd(BaseModel):
    station_id: int
    station_name: str
    capacity: int
    inbound_passengers: int
    outbound_passengers: int
    current_load: int
    crowd_percentage: float
    congestion_status: str


class PassengerTrendPoint(BaseModel):
    date: date
    passengers: int


class HeatmapPoint(BaseModel):
    station_name: str
    load: int
    crowd_percentage: float
    congestion_status: str
