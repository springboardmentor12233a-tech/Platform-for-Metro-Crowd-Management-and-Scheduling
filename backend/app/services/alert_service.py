from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import Alert, EmergencyAnnouncement, OperationalUpdate, TrainSchedule
from app.services.crowd_service import get_station_crowd


def generate_crowd_alerts(db: Session) -> list[Alert]:
    created = []
    station_crowd = get_station_crowd(db, limit=10)
    for item in station_crowd:
        if item["congestion_status"] in ["Moderate", "High", "Overcrowded"]:
            existing = (
                db.query(Alert)
                .filter(Alert.station_name == item["station_name"], Alert.category == "crowd", Alert.is_active.is_(True))
                .first()
            )
            if not existing:
                alert = Alert(
                    title=f"{item['congestion_status']} crowd level detected",
                    station_name=item["station_name"],
                    severity=item["congestion_status"],
                    category="crowd",
                    message=(
                        f"{item['station_name']} has current load {item['current_load']} with "
                        f"{item['crowd_percentage']}% capacity usage. Review frequency and station staffing."
                    ),
                )
                db.add(alert)
                created.append(alert)
    db.commit()
    return created


def list_alerts(db: Session, active_only: bool = True) -> list[Alert]:
    generate_crowd_alerts(db)
    query = db.query(Alert).order_by(desc(Alert.created_at))
    if active_only:
        query = query.filter(Alert.is_active.is_(True))
    return query.limit(30).all()


def list_announcements(db: Session) -> list[EmergencyAnnouncement]:
    return db.query(EmergencyAnnouncement).order_by(desc(EmergencyAnnouncement.created_at)).limit(20).all()


def create_announcement(db: Session, title: str, message: str, target_station: str | None, priority: str, created_by: str):
    announcement = EmergencyAnnouncement(
        title=title,
        message=message,
        target_station=target_station,
        priority=priority,
        created_by=created_by,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


def list_updates(db: Session) -> list[OperationalUpdate]:
    delayed = db.query(TrainSchedule).filter(TrainSchedule.delay_minutes > 0).order_by(desc(TrainSchedule.delay_minutes)).limit(5).all()
    for schedule in delayed:
        exists = (
            db.query(OperationalUpdate)
            .filter(OperationalUpdate.update_type == "delay", OperationalUpdate.line == schedule.line, OperationalUpdate.station_name == schedule.source_station)
            .first()
        )
        if not exists:
            update = OperationalUpdate(
                update_type="delay",
                line=schedule.line,
                station_name=schedule.source_station,
                message=f"{schedule.train_number} delayed by {schedule.delay_minutes} minutes on {schedule.line}.",
                status="Open",
            )
            db.add(update)
    db.commit()
    return db.query(OperationalUpdate).order_by(desc(OperationalUpdate.created_at)).limit(20).all()
