"""
Analytics Schemas
==================
Pydantic models for aggregated metro performance analytics responses.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class MetricPoint(BaseModel):
    """
    A single data point for time-series or categorical charts.

    Attributes:
        label: X-axis label (e.g., time bucket '08:00' or station name).
        value: Numeric value for the label (e.g., passenger count).
    """

    label: str
    value: float


class StationHeatmapPoint(BaseModel):
    """A single station's heat-map occupancy value."""

    station: str
    value: float = Field(..., ge=0.0, le=100.0, description="Average occupancy %")


class AnalyticsSummary(BaseModel):
    """
    Top-level analytics summary for a given reporting period.

    Attributes:
        period:              Reporting window — 'today' | 'week' | 'month'.
        total_passengers:    Total passengers counted in the period.
        peak_hour:           Human-readable peak traffic window.
        avg_crowd_level:     Average crowd occupancy percentage.
        on_time_performance: Percentage of trains running on time.
        incidents_count:     Number of active/resolved incidents.
        hourly_traffic:      Passenger counts per hour of day.
        station_heatmap:     Per-station average occupancy values.
    """

    period: str
    total_passengers: int
    peak_hour: str
    avg_crowd_level: float
    on_time_performance: float
    incidents_count: int
    hourly_traffic: List[MetricPoint]
    station_heatmap: List[Dict[str, Any]]


class LinePerformance(BaseModel):
    """
    Per-line performance breakdown.
    Prepared for a future /analytics/lines endpoint in Milestone 3.
    """

    line: str
    total_trains: int
    on_time_count: int
    delayed_count: int
    cancelled_count: int
    on_time_percent: float
    avg_passengers: int
