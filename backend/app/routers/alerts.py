from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional

from app.database.db import get_db
from app.models.alert import Alert
from app.models.schemas import AlertCreate, AlertResponse
from app.services.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])


@router.post("/", response_model=AlertResponse)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    new_alert = Alert(
        alert_type=alert.alert_type,
        severity=alert.severity,
        station=alert.station,
        message=alert.message,
        created_by=admin.email,
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert


@router.get("/", response_model=List[AlertResponse])
def list_alerts(
    active_only: bool = True,
    alert_type: Optional[str] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    query = db.query(Alert)
    if active_only:
        query = query.filter(Alert.is_active == True)
    if alert_type:
        query = query.filter(Alert.alert_type == alert_type)
    return query.order_by(Alert.created_at.desc()).all()


@router.patch("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(alert_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_active = False
    alert.resolved_at = func.now()
    db.commit()
    db.refresh(alert)
    return alert


@router.post("/emergency", response_model=AlertResponse)
def broadcast_emergency(message: str, station: Optional[str] = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    """
    Convenience endpoint for raising a network-wide (or station-specific)
    emergency announcement. Always created with type=emergency, severity=critical.
    """
    new_alert = Alert(
        alert_type="emergency",
        severity="critical",
        station=station,
        message=message,
        created_by=admin.email,
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert