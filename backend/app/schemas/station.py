from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class StationBase(BaseModel):
    station_name: str
    distance_from_start_km: Optional[float] = None
    line: Optional[str] = None
    opening_date: Optional[date] = None
    station_layout: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coord_invalid: Optional[bool] = None
    distance_from_start_km_outlier: Optional[bool] = None
    opening_year: Optional[int] = None


class StationCreate(StationBase):
    id: int


class StationUpdate(BaseModel):
    station_name: Optional[str] = None
    distance_from_start_km: Optional[float] = None
    line: Optional[str] = None
    opening_date: Optional[date] = None
    station_layout: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coord_invalid: Optional[bool] = None
    distance_from_start_km_outlier: Optional[bool] = None
    opening_year: Optional[int] = None


class StationResponse(StationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)