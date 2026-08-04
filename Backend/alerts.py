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

def check_and_create_overcrowding_alert(db: Session, station: str, crowd_level: str):
    if crowd_level == "High":
        new_alert = Alert(
            alert_type="Overcrowding",
            station=station,
            message=f"High passenger density detected at {station}.",
            severity="High",
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return new_alert
    return None

def check_and_create_delay_alert(db: Session, station: str, delay_minutes: int):
    if delay_minutes >= 10:
        new_alert = Alert(
            alert_type="Delay",
            station=station,
            message=f"Train delay of {delay_minutes} min reported at {station}.",
            severity="Medium" if delay_minutes < 20 else "High",
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return new_alert
    return None