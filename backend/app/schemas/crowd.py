"""
Crowd Monitoring Schemas
=========================
Pydantic models for crowd density data returned by the /crowd endpoints.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class CrowdReading(BaseModel):
    """
    A single real-time crowd reading for one station platform.

    Attributes:
        station_id:       Unique station identifier (e.g., 'ST001').
        station_name:     Human-readable station name.
        platform:         Platform label (e.g., 'Platform 1').
        density_level:    Categorical level — LOW | MEDIUM | HIGH | CRITICAL.
        headcount:        Estimated number of people on the platform.
        capacity:         Maximum safe platform capacity.
        occupancy_percent: Percentage of capacity currently in use.
        timestamp:        UTC datetime of the reading.
    """

    station_id: str
    station_name: str
    platform: str
    density_level: str = Field(..., description="LOW | MEDIUM | HIGH | CRITICAL")
    headcount: int = Field(..., ge=0, description="Estimated passenger count")
    capacity: int = Field(..., gt=0, description="Maximum safe capacity")
    occupancy_percent: float = Field(..., ge=0.0, le=100.0)
    timestamp: datetime

    model_config = {
        "json_schema_extra": {
            "example": {
                "station_id": "ST001",
                "station_name": "Central Station",
                "platform": "Platform 1",
                "density_level": "HIGH",
                "headcount": 1450,
                "capacity": 2000,
                "occupancy_percent": 72.5,
                "timestamp": "2026-07-08T14:30:00Z",
            }
        }
    }


class CrowdSummary(BaseModel):
    """
    Aggregated crowd summary across all monitored stations.

    Attributes:
        total_stations:    Number of stations being monitored.
        critical_count:    Stations currently at CRITICAL density.
        high_count:        Stations currently at HIGH density.
        average_occupancy: Mean occupancy percentage across all stations.
        readings:          List of individual station readings.
    """

    total_stations: int
    critical_count: int
    high_count: int
    average_occupancy: float
    readings: List[CrowdReading]


class CrowdThreshold(BaseModel):
    """
    Configurable thresholds for density level classification.
    Prepared for admin configuration endpoint in Milestone 2.
    """

    low_max: float = Field(40.0, description="Max % occupancy for LOW level")
    medium_max: float = Field(70.0, description="Max % occupancy for MEDIUM level")
    high_max: float = Field(90.0, description="Max % occupancy for HIGH level")
    # CRITICAL is anything above high_max
