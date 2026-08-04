from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).all()
    return alerts


@router.post("/")
def create_alert(alert_type: str, station: str, message: str, severity: str, db: Session = Depends(get_db)):
    new_alert = Alert(
        alert_type=alert_type,
        station=station,
        message=message,
        severity=severity,
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert