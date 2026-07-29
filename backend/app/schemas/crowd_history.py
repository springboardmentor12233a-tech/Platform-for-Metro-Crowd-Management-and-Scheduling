from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CrowdHistoryBase(BaseModel):
    station_id: int
    timestamp: datetime
    entry_count: Optional[int] = None
    exit_count: Optional[int] = None
    platform_count: Optional[int] = None
    concourse_count: Optional[int] = None
    crowd_density: Optional[float] = None


class CrowdHistoryCreate(CrowdHistoryBase):
    id: str


class CrowdHistoryUpdate(BaseModel):
    station_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    entry_count: Optional[int] = None
    exit_count: Optional[int] = None
    platform_count: Optional[int] = None
    concourse_count: Optional[int] = None
    crowd_density: Optional[float] = None


class CrowdHistoryResponse(CrowdHistoryBase):
    id: str

    model_config = ConfigDict(from_attributes=True)