from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CrowdAnalytics(BaseModel):
    id: str
    type: str = "Crowd"
    station_name: Optional[str] = None
    prediction_time: Optional[datetime] = None

    predicted_entries: Optional[int] = None
    predicted_exits: Optional[int] = None
    predicted_crowd_level: Optional[str] = None
    confidence_score: Optional[float] = None


class RidershipAnalytics(BaseModel):
    id: str
    type: str = "Ridership"
    station_name: Optional[str] = None
    prediction_time: Optional[datetime] = None

    predicted_entries: Optional[int] = None
    predicted_exits: Optional[int] = None
    prediction: Optional[int] = None
    confidence_score: Optional[float] = None


class FrequencyAnalytics(BaseModel):
    id: str
    type: str = "Frequency"
    station_name: Optional[str] = None
    prediction_time: Optional[datetime] = None

    occupancy: Optional[int] = None
    capacity: Optional[int] = None
    occupancy_percentage: Optional[float] = None

    current_frequency: Optional[int] = None
    recommended_frequency: Optional[int] = None

    frequency_action: Optional[str] = None
    action_code: Optional[int] = None

    additional_trains_required: Optional[int] = None
    priority: Optional[str] = None
    action_required: Optional[bool] = None

    recommendation: Optional[str] = None
    reason: Optional[str] = None
    estimated_wait_time_impact: Optional[str] = None


class DelayAnalytics(BaseModel):
    id: str
    type: str = "Delay"
    station_name: Optional[str] = None

    route_id: Optional[str] = None
    transport_type: Optional[str] = None
    prediction_time: Optional[datetime] = None

    predicted_delay: Optional[float] = None
    predicted_delay_minutes: Optional[float] = None
    delay_level: Optional[str] = None
    confidence_score: Optional[float] = None


class ScheduleAnalytics(BaseModel):
    id: str
    type: str = "Schedule"

    station_name: Optional[str] = None
    prediction_time: Optional[datetime] = None

    train_id: Optional[str] = None

    schedule_action: Optional[str] = None
    action_code: Optional[int] = None

    reschedule_required: Optional[bool] = None

    current_departure_time: Optional[str] = None
    recommended_departure_time: Optional[str] = None

    current_platform: Optional[int] = None
    recommended_platform: Optional[int] = None

    predicted_passengers: Optional[int] = None
    crowd_level: Optional[str] = None

    current_frequency: Optional[int] = None
    recommended_frequency: Optional[int] = None

    delay_minutes: Optional[float] = None

    train_to_allocate: Optional[str] = None

    recommendation: Optional[str] = None
    reason: Optional[str] = None


class AnalyticsResponse(BaseModel):
    crowd: list[CrowdAnalytics]
    ridership: list[RidershipAnalytics]
    frequency: list[FrequencyAnalytics]
    delay: list[DelayAnalytics]
    schedule: list[ScheduleAnalytics]