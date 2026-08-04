from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.alert import AlertCreate, AlertResponse, AlertResolve
from app.services.alert_service import (
    create_system_alert,
    fetch_system_alerts,
    resolve_system_alert,
)
from app.middleware.auth import require_roles
from app.utils.socket_manager import manager
import asyncio

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.post("/", response_model=AlertResponse, status_code=201)
async def trigger_alert(
    alert: AlertCreate,
    current_user=Depends(require_roles(["admin", "manager"]))
):
    """
    Admin or Manager only.
    Create a new manual alert or emergency announcement.
    """
    try:
        new_alert = create_system_alert(
            alert_type=alert.alert_type,
            severity=alert.severity,
            message=alert.message,
            station_id=alert.station_id,
            train_id=alert.train_id
        )
        
        # Broadcast alert to all connected operators in real time
        try:
            alert_dict = {
                "event": "new_alert",
                "data": {
                    "alert_type": new_alert.get("alert_type") if isinstance(new_alert, dict) else getattr(new_alert, "alert_type", ""),
                    "severity": new_alert.get("severity") if isinstance(new_alert, dict) else getattr(new_alert, "severity", ""),
                    "message": new_alert.get("message") if isinstance(new_alert, dict) else getattr(new_alert, "message", ""),
                    "station_id": new_alert.get("station_id") if isinstance(new_alert, dict) else getattr(new_alert, "station_id", None),
                    "train_id": new_alert.get("train_id") if isinstance(new_alert, dict) else getattr(new_alert, "train_id", None),
                }
            }
            await manager.broadcast(alert_dict)
        except Exception as e:
            print("Failed WebSocket broadcast for triggered alert:", e)

        return new_alert
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create alert: {str(e)}"
        )


@router.get("/", response_model=List[AlertResponse])
def get_alerts(
    unresolved_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    current_user=Depends(require_roles(["admin", "manager", "user"]))
):
    """
    Read all alerts.
    """
    try:
        alerts = fetch_system_alerts(limit=limit, unresolved_only=unresolved_only)
        return alerts
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.put("/{alert_id}/resolve")
def resolve_alert(
    alert_id: str,
    resolve_data: AlertResolve,
    current_user=Depends(require_roles(["admin", "manager"]))
):
    """
    Resolve an active alert.
    """
    try:
        success = resolve_system_alert(alert_id)
        if not success:
            raise Exception("Alert not found or already resolved.")
        return {"success": True, "message": "Alert resolved successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
