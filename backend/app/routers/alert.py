from fastapi import APIRouter, Depends

from app.auth.permissions import require_roles

from app.schemas.alert import (
    AlertResponse,
    EmergencyAlertCreate,
)

from app.services.alert_service import (
    get_alerts,
    create_emergency_alert,
)


router = APIRouter(
    prefix="/alerts",
    tags=["AI Alerts"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
                "Analyst",
            )
        )
    ],
)


# =========================================================
# GET ALL AI + MANUAL ALERTS
# =========================================================

@router.get(
    "/",
    response_model=list[AlertResponse],
)
def alerts():

    return get_alerts()


# =========================================================
# CREATE MANUAL EMERGENCY ALERT
# =========================================================

@router.post(
    "/",
    response_model=AlertResponse,
)
def create_alert(
    alert_data: EmergencyAlertCreate,
):

    alert = create_emergency_alert(
        station=alert_data.station,
        message=alert_data.message,
        severity=alert_data.severity,
        alert_type=alert_data.alert_type,
    )

    return {
        "station": alert.station,

        "predicted_passengers": 0,

        "severity": alert.severity,

        "recommendation": alert.message,

        "created_at": alert.created_at,

        "source": "Manual Emergency",

        "alert_type": alert.alert_type,
    }