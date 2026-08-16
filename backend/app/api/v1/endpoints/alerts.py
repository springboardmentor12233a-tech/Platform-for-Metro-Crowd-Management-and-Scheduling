from datetime import datetime, timezone
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.alert import Alert
from app.models.user import User

from app.core.security import (
    get_current_user,
    require_admin,
)

from app.utils.response import success_response


router = APIRouter()


# ============================================================
# GET ALL ALERTS
# ============================================================

@router.get(
    "/",
    summary="Get All Alerts",
)
def get_alerts(
    severity: Optional[str] = Query(
        None,
        description="LOW | MEDIUM | HIGH | CRITICAL",
    ),
    resolved: Optional[bool] = Query(
        None,
        description="Filter by resolution status",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    query = (
        db.query(Alert)
        .order_by(Alert.timestamp.desc())
    )

    # --------------------------------------------------------
    # Severity filter
    # --------------------------------------------------------

    if severity:

        severity_value = severity.upper()

        valid_severities = {
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
        }

        if severity_value not in valid_severities:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid severity. "
                    "Use LOW, MEDIUM, HIGH or CRITICAL."
                ),
            )

        query = query.filter(
            Alert.severity == severity_value
        )

    # --------------------------------------------------------
    # Resolution filter
    # --------------------------------------------------------

    if resolved is not None:

        if resolved:

            query = query.filter(
                Alert.status.in_(
                    ["RESOLVED", "CLOSED"]
                )
            )

        else:

            query = query.filter(
                Alert.status.notin_(
                    ["RESOLVED", "CLOSED"]
                )
            )

    alerts = query.all()

    result = []

    for alert in alerts:

        is_resolved = alert.status in {
            "RESOLVED",
            "CLOSED",
        }

        result.append(
            {
                "alert_id": str(alert.id),

                "severity": alert.severity,

                "title": alert.alert_type,

                "message": alert.message,

                "station_id": alert.station_id,

                "train_id": alert.train_id,

                "timestamp": (
                    alert.timestamp.isoformat()
                    if alert.timestamp
                    else None
                ),

                "status": alert.status,

                "is_resolved": is_resolved,

                "resolved_at": (
                    alert.resolved_at.isoformat()
                    if alert.resolved_at
                    else None
                ),

                "created_by": (
                    str(alert.created_by)
                    if alert.created_by
                    else None
                ),
            }
        )

    return success_response(
        {
            "total": len(result),

            "unresolved": sum(
                1
                for alert in result
                if not alert["is_resolved"]
            ),

            "alerts": result,
        }
    )


# ============================================================
# CREATE ALERT — ADMIN ONLY
# ============================================================

@router.post(
    "/",
    summary="Create Alert",
)
def create_alert(
    alert_type: str,
    severity: str,
    message: str,
    station_id: Optional[int] = None,
    train_id: Optional[str] = None,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_admin
    ),
):

    severity_value = severity.upper()

    valid_severities = {
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    }

    if severity_value not in valid_severities:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid severity. "
                "Use LOW, MEDIUM, HIGH or CRITICAL."
            ),
        )

    if not message.strip():

        raise HTTPException(
            status_code=400,
            detail="Alert message cannot be empty.",
        )

    alert = Alert(
        timestamp=datetime.now(timezone.utc),
        station_id=station_id,
        train_id=train_id,
        alert_type=alert_type.strip(),
        severity=severity_value,
        message=message.strip(),
        status="OPEN",
        created_by=current_user.id,
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return success_response(
        {
            "message": "Alert created successfully.",

            "alert": {
                "alert_id": str(alert.id),
                "severity": alert.severity,
                "title": alert.alert_type,
                "message": alert.message,
                "station_id": alert.station_id,
                "train_id": alert.train_id,
                "timestamp": alert.timestamp.isoformat(),
                "status": alert.status,
                "is_resolved": False,
                "resolved_at": None,
                "created_by": str(
                    current_user.id
                ),
            },
        }
    )


# ============================================================
# RESOLVE ALERT — ADMIN ONLY
# ============================================================

@router.patch(
    "/{alert_id}/resolve",
    summary="Resolve an Alert",
)
def resolve_alert(
    alert_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_admin
    ),
):

    alert = (
        db.query(Alert)
        .filter(
            Alert.id == alert_id
        )
        .first()
    )

    if alert is None:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    alert.status = "RESOLVED"

    alert.resolved_at = datetime.now(
        timezone.utc
    )

    alert.resolved_by = current_user.id

    db.commit()
    db.refresh(alert)

    return success_response(
        {
            "message": "Alert resolved successfully.",

            "alert_id": str(
                alert.id
            ),

            "is_resolved": True,

            "status": alert.status,

            "resolved_at": (
                alert.resolved_at.isoformat()
            ),
        }
    )