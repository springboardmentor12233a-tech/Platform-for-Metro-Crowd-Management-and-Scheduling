from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal


class StationBase(BaseModel):
    station_name: str = Field(..., min_length=2)
    line_name: str = Field(..., min_length=2)

    distance_from_start: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    opening_date: Optional[date] = None
    station_layout: Optional[str] = None

    latitude: Decimal
    longitude: Decimal

    is_interchange: bool = False


class StationCreate(StationBase):
    pass


class StationUpdate(BaseModel):
    station_name: Optional[str] = Field(None, min_length=2)
    line_name: Optional[str] = Field(None, min_length=2)
    distance_from_start: Optional[Decimal] = Field(None, ge=0)
    opening_date: Optional[date] = None
    station_layout: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    is_interchange: Optional[bool] = None


class StationResponse(StationBase):
    station_id: int

    class Config:
        from_attributes = True