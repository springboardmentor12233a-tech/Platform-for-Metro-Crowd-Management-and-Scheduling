from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import CrowdLevel


class OccupancyBase(BaseModel):
    train_id: str
    station_id: int
    timestamp: datetime
    occupancy: Optional[int] = None
    capacity: Optional[int] = None
    occupancy_percentage: Optional[float] = None
    crowd_level: Optional[CrowdLevel] = None


class OccupancyCreate(OccupancyBase):
    id: str


class OccupancyUpdate(BaseModel):
    train_id: Optional[str] = None
    station_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    occupancy: Optional[int] = None
    capacity: Optional[int] = None
    occupancy_percentage: Optional[float] = None
    crowd_level: Optional[CrowdLevel] = None


class OccupancyResponse(OccupancyBase):
    id: str

    model_config = ConfigDict(from_attributes=True)