from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.models import Alert, PassengerFlow, Station, TrainSchedule
from app.services.crowd_service import get_heatmap
from app.services.prediction_service import get_demand_forecast


def get_analytics_report(db: Session) -> dict:
    station_count = int(db.query(func.count(Station.id)).scalar() or 0)
    active_alerts = int(db.query(func.count(Alert.id)).filter(Alert.is_active.is_(True)).scalar() or 0)
    delayed_trains = int(db.query(func.count(TrainSchedule.id)).filter(TrainSchedule.delay_minutes > 0).scalar() or 0)
    forecast = get_demand_forecast(db, days=7)["forecast"]
    predicted_peak = max([point["predicted_passengers"] for point in forecast], default=0)

    station_rows = (
        db.query(Station.name, func.sum(PassengerFlow.passengers).label("passengers"))
        .join(PassengerFlow, PassengerFlow.from_station_id == Station.id)
        .group_by(Station.name)
        .order_by(desc("passengers"))
        .limit(8)
        .all()
    )
    station_performance = [{"label": name, "value": float(value or 0)} for name, value in station_rows]

    insights = [
        f"{station_count} stations are available in the monitoring dataset after import and cleaning.",
        f"{delayed_trains} train schedules currently show operational delays and need monitoring.",
        f"Predicted peak demand for the next forecast window is {predicted_peak:,} passengers.",
        "Congestion heatmaps and station tables help operators prioritize station-level crowd control.",
        "AI insights are derived from passenger flow, ticketing, remarks, station load, and schedule delay records.",
    ]

    return {
        "station_count": station_count,
        "active_alerts": active_alerts,
        "delayed_trains": delayed_trains,
        "predicted_peak_passengers": predicted_peak,
        "congestion_heatmap": get_heatmap(db, limit=12),
        "operational_insights": insights,
        "station_performance": station_performance,
    }
