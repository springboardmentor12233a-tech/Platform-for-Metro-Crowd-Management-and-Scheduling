"""
Analytics Endpoints
====================
Returns aggregated metro system performance metrics and reports.

Milestone 1: Returns rich dummy aggregated data for dashboard population.
Milestone 2: Will query the analytics service which reads from TimescaleDB/PostgreSQL.
Milestone 3: Will add export functionality (CSV/PDF via background tasks).

Routes:
    GET /api/v1/analytics         -- Analytics summary for a given period.
    GET /api/v1/analytics/export  -- Export analytics report (stub).
    GET /api/v1/analytics/lines   -- Per-line performance breakdown.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Query

from app.utils.response import success_response

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# Dummy Analytics Data (rich dataset to power dashboard charts)
# ---------------------------------------------------------------------------
HOURLY_TRAFFIC = [
    {"label": "06:00", "value": 4200},
    {"label": "07:00", "value": 8900},
    {"label": "08:00", "value": 15600},
    {"label": "09:00", "value": 12300},
    {"label": "10:00", "value": 7800},
    {"label": "11:00", "value": 6100},
    {"label": "12:00", "value": 9200},
    {"label": "13:00", "value": 8700},
    {"label": "14:00", "value": 7400},
    {"label": "15:00", "value": 6800},
    {"label": "16:00", "value": 9600},
    {"label": "17:00", "value": 14200},
    {"label": "18:00", "value": 16800},
    {"label": "19:00", "value": 11200},
    {"label": "20:00", "value": 6400},
    {"label": "21:00", "value": 4100},
    {"label": "22:00", "value": 2300},
]

STATION_HEATMAP = [
    {"station": "Central Station", "value": 88},
    {"station": "East Junction", "value": 95},
    {"station": "North Terminal", "value": 45},
    {"station": "South Bridge", "value": 72},
    {"station": "West Gate", "value": 31},
    {"station": "Airport Link", "value": 58},
]

LINE_PERFORMANCE = [
    {
        "line": "Blue Line",
        "total_trains": 12,
        "on_time_count": 10,
        "delayed_count": 1,
        "cancelled_count": 1,
        "on_time_percent": 83.3,
        "avg_passengers": 1200,
    },
    {
        "line": "Red Line",
        "total_trains": 8,
        "on_time_count": 6,
        "delayed_count": 2,
        "cancelled_count": 0,
        "on_time_percent": 75.0,
        "avg_passengers": 980,
    },
    {
        "line": "Green Line",
        "total_trains": 6,
        "on_time_count": 6,
        "delayed_count": 0,
        "cancelled_count": 0,
        "on_time_percent": 100.0,
        "avg_passengers": 640,
    },
    {
        "line": "Yellow Line",
        "total_trains": 4,
        "on_time_count": 4,
        "delayed_count": 0,
        "cancelled_count": 0,
        "on_time_percent": 100.0,
        "avg_passengers": 520,
    },
]

# Period-specific multipliers for scaling demo data
PERIOD_MULTIPLIERS = {
    "today": 1.0,
    "week": 6.8,
    "month": 29.5,
}


# ---------------------------------------------------------------------------
# GET /analytics/
# ---------------------------------------------------------------------------
@router.get(
    "/",
    summary="Get Analytics Summary",
    description=(
        "Returns aggregated performance analytics for the specified period. "
        "Includes passenger counts, on-time performance, and hourly traffic data."
    ),
)
async def get_analytics(
    period: str = Query(
        "today",
        description="Reporting period: today | week | month",
    ),
) -> dict:
    """
    Returns aggregated analytics for the specified time period.

    Args:
        period: One of 'today', 'week', or 'month'.
    """
    multiplier = PERIOD_MULTIPLIERS.get(period, 1.0)

    return success_response(
        {
            "period": period,
            "total_passengers": int(142850 * multiplier),
            "peak_hour": "08:30 - 09:30",
            "avg_crowd_level": 63.4,
            "on_time_performance": 87.2,
            "incidents_count": int(3 * multiplier),
            "total_trains_operated": int(30 * multiplier),
            "revenue_trips": int(142850 * multiplier * 0.94),
            "hourly_traffic": HOURLY_TRAFFIC,
            "station_heatmap": STATION_HEATMAP,
        },
        message=f"Analytics summary for '{period}' retrieved successfully",
    )


# ---------------------------------------------------------------------------
# GET /analytics/lines
# ---------------------------------------------------------------------------
@router.get(
    "/lines",
    summary="Per-Line Performance Breakdown",
    description="Returns on-time performance and passenger statistics broken down by metro line.",
)
async def get_line_performance() -> dict:
    """Returns per-line performance metrics."""
    return success_response(
        {"total_lines": len(LINE_PERFORMANCE), "lines": LINE_PERFORMANCE},
        message="Line performance data retrieved successfully",
    )


# ---------------------------------------------------------------------------
# GET /analytics/export
# ---------------------------------------------------------------------------
@router.get(
    "/export",
    summary="Export Analytics Report",
    description=(
        "Initiates generation of a downloadable analytics report. "
        "Milestone 1: Returns a stub response. "
        "Milestone 3: Will trigger a Celery background task and return a download URL."
    ),
)
async def export_analytics(
    period: str = Query("today", description="Period to export: today | week | month"),
    fmt: str = Query("csv", alias="format", description="Export format: csv | pdf | excel"),
) -> dict:
    """
    Export analytics as a file (stub for Milestone 3).

    Args:
        period: Time period for the report.
        fmt:    Output file format.
    """
    return success_response(
        {
            "message": "Report export is prepared for Milestone 3",
            "requested_period": period,
            "requested_format": fmt.upper(),
            "status": "not_implemented",
            "eta": "Available in Milestone 3",
        },
        message="Export endpoint acknowledged",
    )
