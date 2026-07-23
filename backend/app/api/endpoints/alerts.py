from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Alert, Station, User, AuditLog
from app.schemas import AlertResponse, AlertCreate
from app.api.deps import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
def read_alerts(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status)
        
    alerts = query.order_by(Alert.triggered_at.desc()).all()
    
    # Map station names to response
    response_list = []
    for a in alerts:
        station = db.query(Station).filter(Station.id == a.station_id).first()
        response_list.append(
            AlertResponse(
                id=a.id,
                station_id=a.station_id,
                severity=a.severity,
                description=a.description,
                status=a.status,
                triggered_at=a.triggered_at,
                resolved_at=a.resolved_at,
                resolved_by=a.resolved_by,
                station_name=station.name if station else "Unknown"
            )
        )
    return response_list

@router.post("/", response_model=AlertResponse)
def create_alert(
    alert_in: AlertCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify station exists
    station = db.query(Station).filter(Station.id == alert_in.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
        
    # Enforce permissions: admin, operator or station master of this station
    if current_user.role == "passenger":
        raise HTTPException(status_code=403, detail="Passengers cannot create alerts")
    if current_user.role == "station_master" and current_user.station_id != alert_in.station_id:
        raise HTTPException(status_code=403, detail="Station masters can only trigger alerts for their own station")

    alert = Alert(
        id=uuid.uuid4(),
        station_id=alert_in.station_id,
        severity=alert_in.severity,
        description=alert_in.description,
        status="Active",
        triggered_at=datetime.utcnow()
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="TRIGGER_ALERT",
        details=f"Created {alert.severity} alert for {station.name}: '{alert.description}'"
    ))
    db.commit()
    
    return alert

@router.post("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(
    alert_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify permissions: admin, operator, or station master of that station
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if current_user.role == "passenger":
        raise HTTPException(status_code=403, detail="Passengers cannot resolve alerts")
    if current_user.role == "station_master" and current_user.station_id != alert.station_id:
        raise HTTPException(status_code=403, detail="Station masters can only resolve alerts for their own station")

    alert.status = "Resolved"
    alert.resolved_at = datetime.utcnow()
    alert.resolved_by = current_user.id
    
    # Audit log
    station = db.query(Station).filter(Station.id == alert.station_id).first()
    station_name = station.name if station else "Unknown"
    
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="RESOLVE_ALERT",
        details=f"Resolved alert on station {station_name}: '{alert.description}'"
    ))
    db.commit()
    db.refresh(alert)
    
    return alert
