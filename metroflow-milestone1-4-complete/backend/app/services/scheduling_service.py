from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import PassengerFlow, Station, TrainSchedule
from app.services.crowd_service import get_station_crowd


def _frequency_from_percentage(percentage: float) -> int:
    if percentage >= 90:
        return 3
    if percentage >= 70:
        return 4
    if percentage >= 40:
        return 6
    return 9


def get_train_schedules(db: Session, line: str | None = None) -> list[TrainSchedule]:
    query = db.query(TrainSchedule).order_by(TrainSchedule.departure_time)
    if line:
        query = query.filter(TrainSchedule.line.ilike(f"%{line}%"))
    return query.all()


def update_train_delay(db: Session, schedule_id: int, delay_minutes: int, status: str) -> TrainSchedule | None:
    schedule = db.query(TrainSchedule).filter(TrainSchedule.id == schedule_id).first()
    if not schedule:
        return None
    schedule.delay_minutes = delay_minutes
    schedule.status = status
    db.commit()
    db.refresh(schedule)
    return schedule


def get_frequency_recommendations(db: Session, limit: int = 8) -> list[dict]:
    station_crowd = get_station_crowd(db, limit=limit)
    recommendations = []
    for item in station_crowd:
        station = db.query(Station).filter(Station.name == item["station_name"]).first()
        current_frequency = 8
        schedule = db.query(TrainSchedule).filter(TrainSchedule.source_station == item["station_name"]).first()
        if schedule:
            current_frequency = schedule.frequency_minutes
        recommended = _frequency_from_percentage(item["crowd_percentage"])
        if recommended < current_frequency:
            action = f"Increase train frequency to every {recommended} minutes during peak load."
        elif recommended > current_frequency:
            action = f"Maintain normal service and monitor every {recommended} minutes."
        else:
            action = "Current train frequency is suitable for the observed crowd level."
        recommendations.append(
            {
                "station_name": item["station_name"],
                "line": station.line if station else "Unknown",
                "current_load": item["current_load"],
                "crowd_percentage": item["crowd_percentage"],
                "current_frequency": current_frequency,
                "recommended_frequency": recommended,
                "recommendation": action,
            }
        )
    return recommendations


def get_operational_monitoring(db: Session) -> dict:
    active_trains = int(db.query(func.count(TrainSchedule.id)).scalar() or 0)
    delayed_trains = int(db.query(func.count(TrainSchedule.id)).filter(TrainSchedule.delay_minutes > 0).scalar() or 0)
    average_delay = float(db.query(func.coalesce(func.avg(TrainSchedule.delay_minutes), 0)).scalar() or 0)
    high_risk = len([item for item in get_station_crowd(db, limit=100) if item["congestion_status"] in ["High", "Overcrowded"]])
    total_passengers = int(db.query(func.coalesce(func.sum(PassengerFlow.passengers), 0)).scalar() or 0)

    return {
        "active_trains": active_trains,
        "delayed_trains": delayed_trains,
        "average_delay_minutes": round(average_delay, 2),
        "high_risk_stations": high_risk,
        "metrics": [
            {"label": "Active schedules", "value": str(active_trains), "helper": "Train schedule records monitored"},
            {"label": "Delayed trains", "value": str(delayed_trains), "helper": "Schedules with delay above zero"},
            {"label": "Average delay", "value": f"{round(average_delay, 1)} min", "helper": "Operational delay indicator"},
            {"label": "Passenger records", "value": f"{total_passengers:,}", "helper": "Ridership data used for monitoring"},
        ],
    }
