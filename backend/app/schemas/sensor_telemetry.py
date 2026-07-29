from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import DeviceStatus


class SensorTelemetryBase(BaseModel):
    station_id: int
    timestamp: datetime
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2_ppm: Optional[float] = None
    pm25: Optional[float] = None
    platform_crowd: Optional[int] = None
    escalator_status: Optional[DeviceStatus] = None
    lift_status: Optional[DeviceStatus] = None
    camera_status: Optional[DeviceStatus] = None


class SensorTelemetryCreate(SensorTelemetryBase):
    id: str


class SensorTelemetryUpdate(BaseModel):
    station_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2_ppm: Optional[float] = None
    pm25: Optional[float] = None
    platform_crowd: Optional[int] = None
    escalator_status: Optional[DeviceStatus] = None
    lift_status: Optional[DeviceStatus] = None
    camera_status: Optional[DeviceStatus] = None


class SensorTelemetryResponse(SensorTelemetryBase):
    id: str

    model_config = ConfigDict(from_attributes=True)