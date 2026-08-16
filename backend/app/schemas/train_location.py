from typing import Optional

from pydantic import BaseModel


class TrainLocationResponse(BaseModel):

    train_id: str

    line: Optional[str] = None

    current_station: Optional[str] = None

    next_station: Optional[str] = None

    latitude: Optional[float] = None

    longitude: Optional[float] = None

    speed_kmh: Optional[float] = None

    status: str

    location_source: str

    sensor_available: bool

    platform_crowd: Optional[int] = None

    temperature: Optional[float] = None

    humidity: Optional[float] = None

    co2_ppm: Optional[int] = None

    pm25: Optional[int] = None

    escalator_status: Optional[str] = None

    lift_status: Optional[str] = None

    camera_status: Optional[str] = None

    timestamp: Optional[str] = None


class TrainLocationListResponse(BaseModel):

    trains: list[TrainLocationResponse]

    total_trains: int