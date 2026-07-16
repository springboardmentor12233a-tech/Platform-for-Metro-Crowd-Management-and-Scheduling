"""
Train Status Schemas
=====================
Pydantic models for real-time train position and status data.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class TrainStatus(BaseModel):
    """
    Real-time status record for a single train.

    Attributes:
        train_id:          Internal unique identifier (e.g., 'TRN001').
        train_number:      Fleet number shown to passengers (e.g., 'MT-101').
        line:              Metro line name (e.g., 'Blue Line').
        current_station:   Name of the station the train is currently at or nearest to.
        next_station:      Name of the upcoming station, or 'N/A' if at terminus.
        status:            ON_TIME | DELAYED | CANCELLED | ARRIVED.
        delay_minutes:     Delay in minutes (0 if on time or cancelled).
        speed_kmh:         Current travel speed in km/h (0 if stationary/cancelled).
        occupancy_percent: Estimated passenger occupancy as a percentage of capacity.
        direction:         Human-readable direction (e.g., 'Northbound').
    """

    train_id: str
    train_number: str
    line: str
    current_station: str
    next_station: str
    status: str = Field(..., description="ON_TIME | DELAYED | CANCELLED | ARRIVED")
    delay_minutes: int = Field(..., ge=0)
    speed_kmh: float = Field(..., ge=0.0)
    occupancy_percent: float = Field(..., ge=0.0, le=100.0)
    direction: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "train_id": "TRN001",
                "train_number": "MT-101",
                "line": "Blue Line",
                "current_station": "Central Station",
                "next_station": "East Junction",
                "status": "ON_TIME",
                "delay_minutes": 0,
                "speed_kmh": 75.0,
                "occupancy_percent": 68.2,
                "direction": "Northbound",
            }
        }
    }


class TrainStatusList(BaseModel):
    """
    Collection of train statuses with operational summary counts.

    Attributes:
        total:         Total trains in the response.
        on_time_count: Number of trains running on schedule.
        delayed_count: Number of trains currently delayed.
        trains:        List of individual train status records.
    """

    total: int
    on_time_count: int
    delayed_count: int
    trains: List[TrainStatus]


class TrainPositionUpdate(BaseModel):
    """
    Payload for updating a train's real-time position.
    Prepared for WebSocket / IoT feed integration in Milestone 3.
    """

    train_id: str
    current_station: str
    speed_kmh: float = Field(..., ge=0.0)
    occupancy_percent: float = Field(..., ge=0.0, le=100.0)
    delay_minutes: int = Field(0, ge=0)
