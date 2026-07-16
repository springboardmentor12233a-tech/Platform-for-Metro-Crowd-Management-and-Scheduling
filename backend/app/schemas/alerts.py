"""
Alert Schemas
==============
Pydantic models for crowd management alert records and list responses.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Alert(BaseModel):
    """
    A single system alert record.

    Attributes:
        alert_id:    Unique alert identifier (e.g., 'ALT001').
        severity:    INFO | WARNING | CRITICAL.
        title:       Short human-readable alert title.
        message:     Detailed description of the alert condition.
        station:     Station name associated with the alert, or None for system-wide.
        timestamp:   UTC datetime when the alert was created.
        is_resolved: Whether the alert has been acknowledged and resolved.
        resolved_at: UTC datetime of resolution, or None if still active.
    """

    alert_id: str
    severity: str = Field(..., description="INFO | WARNING | CRITICAL")
    title: str
    message: str
    station: Optional[str] = None
    timestamp: datetime
    is_resolved: bool
    resolved_at: Optional[datetime] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "alert_id": "ALT001",
                "severity": "CRITICAL",
                "title": "Overcrowding — East Junction",
                "message": "Platform occupancy at 95.4%. Immediate crowd control required.",
                "station": "East Junction",
                "timestamp": "2026-07-08T14:25:00Z",
                "is_resolved": False,
                "resolved_at": None,
            }
        }
    }


class AlertList(BaseModel):
    """
    Paginated list of alerts with resolution summary.

    Attributes:
        total:      Total alerts matching the query.
        unresolved: Count of alerts not yet resolved.
        alerts:     List of alert records.
    """

    total: int
    unresolved: int
    alerts: List[Alert]


class AlertResolveRequest(BaseModel):
    """
    Request body for resolving an alert.
    Prepared for PATCH /alerts/{alert_id}/resolve in Milestone 2.
    """

    resolution_note: Optional[str] = Field(
        None, description="Optional note explaining how the alert was resolved"
    )
    resolved_by: Optional[str] = Field(
        None, description="Name or ID of the operator who resolved the alert"
    )
