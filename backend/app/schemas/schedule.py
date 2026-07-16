"""
Schedule Schemas
=================
Pydantic models for train schedule request/response bodies.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class TrainSchedule(BaseModel):
    """
    A single train schedule record.

    Attributes:
        schedule_id:    Unique schedule identifier (e.g., 'SCH001').
        train_number:   Train fleet number (e.g., 'MT-101').
        line:           Metro line name (e.g., 'Blue Line').
        origin:         Departure station name.
        destination:    Terminal station name.
        departure_time: Scheduled departure in HH:MM format.
        arrival_time:   Scheduled arrival in HH:MM format.
        status:         ON_TIME | DELAYED | CANCELLED | ARRIVED.
        platform:       Platform number at origin station.
        stops:          Ordered list of intermediate stops including origin/destination.
    """

    schedule_id: str
    train_number: str
    line: str
    origin: str
    destination: str
    departure_time: str = Field(..., description="Format: HH:MM")
    arrival_time: str = Field(..., description="Format: HH:MM")
    status: str = Field(..., description="ON_TIME | DELAYED | CANCELLED | ARRIVED")
    platform: int = Field(..., ge=1)
    stops: List[str]

    model_config = {
        "json_schema_extra": {
            "example": {
                "schedule_id": "SCH001",
                "train_number": "MT-101",
                "line": "Blue Line",
                "origin": "Central Station",
                "destination": "North Terminal",
                "departure_time": "06:00",
                "arrival_time": "06:45",
                "status": "ON_TIME",
                "platform": 1,
                "stops": ["Central Station", "East Junction", "North Terminal"],
            }
        }
    }


class ScheduleList(BaseModel):
    """
    Paginated list of train schedules.

    Attributes:
        total:     Total number of matching schedules.
        date:      The date for which schedules are returned (YYYY-MM-DD).
        schedules: List of schedule records.
    """

    total: int
    date: str
    schedules: List[TrainSchedule]


class ScheduleUpdateRequest(BaseModel):
    """
    Request body for updating a schedule's status.
    Prepared for operator PATCH endpoint in Milestone 2.
    """

    status: str = Field(..., description="New status: ON_TIME | DELAYED | CANCELLED")
    delay_minutes: Optional[int] = Field(None, ge=0, description="Delay duration in minutes")
    reason: Optional[str] = Field(None, description="Human-readable reason for the update")
