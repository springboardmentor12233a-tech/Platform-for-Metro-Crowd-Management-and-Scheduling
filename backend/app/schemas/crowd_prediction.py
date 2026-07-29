from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import CrowdLevel


class CrowdPredictionBase(BaseModel):
    station_id: int
    prediction_time: datetime
    predicted_entries: Optional[int] = None
    predicted_exits: Optional[int] = None
    predicted_platform_crowd: Optional[int] = None
    predicted_crowd_level: Optional[CrowdLevel] = None
    confidence_score: Optional[float] = None


class CrowdPredictionCreate(CrowdPredictionBase):
    id: str


class CrowdPredictionUpdate(BaseModel):
    station_id: Optional[int] = None
    prediction_time: Optional[datetime] = None
    predicted_entries: Optional[int] = None
    predicted_exits: Optional[int] = None
    predicted_platform_crowd: Optional[int] = None
    predicted_crowd_level: Optional[CrowdLevel] = None
    confidence_score: Optional[float] = None


class CrowdPredictionResponse(CrowdPredictionBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class CrowdPredictionRequest(BaseModel):
    station_name: str
    entry_count: int
    exit_count: int
    platform_count: int
    concourse_count: int
    hour: int
    day: int
    month: int
    day_of_week: int
    weekend: int