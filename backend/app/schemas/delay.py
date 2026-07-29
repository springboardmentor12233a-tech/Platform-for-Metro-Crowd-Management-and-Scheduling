import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import (
    Season,
    TransportType,
    WeatherCondition,
    Weekday,
)


class DelayBase(BaseModel):
    train_id: Optional[str] = None
    origin_station_id: int
    destination_station_id: int

    date: Optional[datetime.date] = None
    time: Optional[datetime.time] = None

    transport_type: Optional[TransportType] = None

    scheduled_departure: Optional[datetime.time] = None
    scheduled_arrival: Optional[datetime.time] = None

    actual_departure_delay_min: Optional[float] = None
    actual_arrival_delay_min: Optional[float] = None

    weather_condition: Optional[WeatherCondition] = None
    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    precipitation_mm: Optional[float] = None

    event_type: Optional[str] = None
    event_attendance_est: Optional[int] = None
    traffic_congestion_index: Optional[float] = None

    holiday: Optional[bool] = None
    peak_hour: Optional[bool] = None

    weekday: Optional[Weekday] = None
    season: Optional[Season] = None

    delayed: Optional[bool] = None

    time_min: Optional[int] = None
    scheduled_departure_min: Optional[int] = None
    scheduled_arrival_min: Optional[int] = None

    is_delayed_5min: Optional[bool] = None

    year: Optional[int] = None
    month: Optional[int] = None
    day_of_week: Optional[str] = None
    is_weekend: Optional[bool] = None

    actual_departure_delay_min_outlier: Optional[bool] = None
    actual_arrival_delay_min_outlier: Optional[bool] = None
    event_attendance_est_outlier: Optional[bool] = None
    traffic_congestion_index_outlier: Optional[bool] = None


class DelayCreate(DelayBase):
    id: str


class DelayUpdate(BaseModel):
    train_id: Optional[str] = None
    origin_station_id: Optional[int] = None
    destination_station_id: Optional[int] = None

    date: Optional[datetime.date] = None
    time: Optional[datetime.time] = None

    transport_type: Optional[TransportType] = None

    scheduled_departure: Optional[datetime.time] = None
    scheduled_arrival: Optional[datetime.time] = None

    actual_departure_delay_min: Optional[float] = None
    actual_arrival_delay_min: Optional[float] = None

    weather_condition: Optional[WeatherCondition] = None
    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    precipitation_mm: Optional[float] = None

    event_type: Optional[str] = None
    event_attendance_est: Optional[int] = None
    traffic_congestion_index: Optional[float] = None

    holiday: Optional[bool] = None
    peak_hour: Optional[bool] = None

    weekday: Optional[Weekday] = None
    season: Optional[Season] = None

    delayed: Optional[bool] = None

    time_min: Optional[int] = None
    scheduled_departure_min: Optional[int] = None
    scheduled_arrival_min: Optional[int] = None

    is_delayed_5min: Optional[bool] = None

    year: Optional[int] = None
    month: Optional[int] = None
    day_of_week: Optional[str] = None
    is_weekend: Optional[bool] = None

    actual_departure_delay_min_outlier: Optional[bool] = None
    actual_arrival_delay_min_outlier: Optional[bool] = None
    event_attendance_est_outlier: Optional[bool] = None
    traffic_congestion_index_outlier: Optional[bool] = None


class DelayResponse(DelayBase):
    id: str

    model_config = ConfigDict(from_attributes=True)