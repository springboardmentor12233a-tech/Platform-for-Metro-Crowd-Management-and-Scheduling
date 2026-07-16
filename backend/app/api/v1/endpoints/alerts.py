"""
Alerts Endpoints
=================
Manages crowd management alerts and notifications.
Milestone 1: Returns dummy alert data.
"""
from fastapi import APIRouter, Query
from datetime import datetime, timezone, timedelta
from app.utils.response import success_response

router = APIRouter()

_base = datetime.now(timezone.utc)

DUMMY_ALERTS = [
    {
        "alert_id": "ALT001", "severity": "CRITICAL",
        "title": "Overcrowding — East Junction",
        "message": "Platform occupancy at 95.4%. Immediate crowd control required.",
        "station": "East Junction",
        "timestamp": (_base - timedelta(minutes=5)).isoformat(),
        "is_resolved": False, "resolved_at": None,
    },
    {
        "alert_id": "ALT002", "severity": "WARNING",
        "title": "Train MT-202 Delayed",
        "message": "Red Line train MT-202 is delayed by 12 minutes due to signal fault.",
        "station": "South Bridge",
        "timestamp": (_base - timedelta(minutes=18)).isoformat(),
        "is_resolved": False, "resolved_at": None,
    },
    {
        "alert_id": "ALT003", "severity": "INFO",
        "title": "Schedule Updated",
        "message": "Green Line schedule adjusted for maintenance window.",
        "station": None,
        "timestamp": (_base - timedelta(hours=1)).isoformat(),
        "is_resolved": True,
        "resolved_at": (_base - timedelta(minutes=30)).isoformat(),
    },
    {
        "alert_id": "ALT004", "severity": "CRITICAL",
        "title": "Train MT-404 Cancelled",
        "message": "Blue Line MT-404 cancelled. Passengers advised to use alternate route.",
        "station": "North Terminal",
        "timestamp": (_base - timedelta(minutes=45)).isoformat(),
        "is_resolved": False, "resolved_at": None,
    },
]


@router.get("/", summary="Get All Alerts")
async def get_alerts(
    severity: str = Query(None, description="Filter by severity: CRITICAL | WARNING | INFO"),
    resolved: bool = Query(None, description="Filter by resolution status"),
):
    """Returns all alerts, optionally filtered by severity and resolution status."""
    alerts = DUMMY_ALERTS
    if severity:
        alerts = [a for a in alerts if a["severity"] == severity.upper()]
    if resolved is not None:
        alerts = [a for a in alerts if a["is_resolved"] == resolved]
    return success_response({
        "total": len(alerts),
        "unresolved": sum(1 for a in alerts if not a["is_resolved"]),
        "alerts": alerts,
    })


@router.patch("/{alert_id}/resolve", summary="Resolve an Alert")
async def resolve_alert(alert_id: str):
    """Marks an alert as resolved (stub — no DB write in Milestone 1)."""
    return success_response({
        "alert_id": alert_id,
        "is_resolved": True,
        "resolved_at": datetime.now(timezone.utc).isoformat(),
    })
