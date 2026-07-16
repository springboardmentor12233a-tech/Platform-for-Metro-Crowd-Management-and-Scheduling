"""
Scheduling Endpoints
=====================
Manages train schedule retrieval. Operators can view and filter schedules.

Milestone 1: Returns hardcoded dummy schedule data.
Milestone 2: Will delegate to ScheduleRepository for real DB reads.
             Will add POST/PATCH endpoints for schedule creation and updates.

Routes:
    GET /api/v1/schedules              — All train schedules (filterable by line/status).
    GET /api/v1/schedules/{schedule_id} — Single schedule detail by ID.
"""

import logging
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.utils.response import success_response

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# Dummy Schedule Data
# ---------------------------------------------------------------------------
DUMMY_SCHEDULES: list[dict] = [
    {
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
        "frequency_minutes": 10,
        "days_of_operation": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    {
        "schedule_id": "SCH002",
        "train_number": "MT-202",
        "line": "Red Line",
        "origin": "South Bridge",
        "destination": "Airport Link",
        "departure_time": "06:15",
        "arrival_time": "07:00",
        "status": "DELAYED",
        "platform": 2,
        "stops": ["South Bridge", "West Gate", "Airport Link"],
        "frequency_minutes": 12,
        "days_of_operation": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    {
        "schedule_id": "SCH003",
        "train_number": "MT-303",
        "line": "Green Line",
        "origin": "West Gate",
        "destination": "East Junction",
        "departure_time": "06:30",
        "arrival_time": "07:15",
        "status": "ON_TIME",
        "platform": 3,
        "stops": ["West Gate", "Central Station", "East Junction"],
        "frequency_minutes": 15,
        "days_of_operation": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    {
        "schedule_id": "SCH004",
        "train_number": "MT-404",
        "line": "Blue Line",
        "origin": "North Terminal",
        "destination": "South Bridge",
        "departure_time": "06:45",
        "arrival_time": "07:30",
        "status": "CANCELLED",
        "platform": 1,
        "stops": ["North Terminal", "Central Station", "South Bridge"],
        "frequency_minutes": 10,
        "days_of_operation": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    {
        "schedule_id": "SCH005",
        "train_number": "MT-505",
        "line": "Yellow Line",
        "origin": "Airport Link",
        "destination": "South Bridge",
        "departure_time": "07:00",
        "arrival_time": "07:50",
        "status": "ON_TIME",
        "platform": 2,
        "stops": ["Airport Link", "East Junction", "Central Station", "South Bridge"],
        "frequency_minutes": 20,
        "days_of_operation": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
]


# ---------------------------------------------------------------------------
# GET /schedules/
# ---------------------------------------------------------------------------
@router.get(
    "/",
    summary="Get All Schedules",
    description=(
        "Returns all train schedules for today. "
        "Optionally filter by metro line or current status."
    ),
)
async def get_schedules(
    line: Optional[str] = Query(
        None,
        description="Filter by metro line (e.g., 'Blue Line', 'Red Line')",
    ),
    status_filter: Optional[str] = Query(
        None,
        alias="status",
        description="Filter by status: ON_TIME | DELAYED | CANCELLED | ARRIVED",
    ),
) -> dict:
    """
    Returns all train schedules, optionally filtered by line and/or status.
    """
    schedules = DUMMY_SCHEDULES

    if line:
        schedules = [s for s in schedules if s["line"].lower() == line.lower()]
    if status_filter:
        schedules = [s for s in schedules if s["status"] == status_filter.upper()]

    logger.debug(f"Returning {len(schedules)} schedules (line={line}, status={status_filter})")

    return success_response(
        {
            "total": len(schedules),
            "date": str(date.today()),
            "filters_applied": {
                "line": line,
                "status": status_filter,
            },
            "schedules": schedules,
        },
        message="Schedules retrieved successfully",
    )


# ---------------------------------------------------------------------------
# GET /schedules/{schedule_id}
# ---------------------------------------------------------------------------
@router.get(
    "/{schedule_id}",
    summary="Get Schedule by ID",
    description="Returns the full detail of a specific train schedule by its unique ID.",
)
async def get_schedule(schedule_id: str) -> dict:
    """
    Returns a specific schedule by its ID.

    Args:
        schedule_id: The unique schedule identifier (e.g., 'SCH001').

    Raises:
        HTTPException 404: If no schedule matches the given ID.
    """
    schedule = next(
        (s for s in DUMMY_SCHEDULES if s["schedule_id"] == schedule_id.upper()),
        None,
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule '{schedule_id}' not found. Valid IDs: SCH001-SCH005.",
        )

    return success_response(schedule, message=f"Schedule {schedule_id} retrieved successfully")
