from sqlalchemy import func, text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.prediction_history import PredictionHistory
from app.models.station import Station
from app.models.route import Route
from app.models.train import Train
from app.models.passenger_data import PassengerData
from app.services.alert_service import fetch_system_alerts


def get_dashboard_summary(db: Session):
    # Total entities counts
    total_stations = db.query(Station).count()
    total_routes = db.query(Route).count()
    total_trains = db.query(Train).count()
    
    # Active & Delayed Trains
    active_trains = db.query(Train).filter(Train.status == "Active").count()
    delayed_trains = db.query(Train).filter(Train.status == "Delayed").count()
    
    # Passenger totals
    total_passengers = db.query(func.sum(PassengerData.passenger_count)).scalar() or 0
    
    # Average passenger count per trip
    avg_passengers = db.query(func.avg(PassengerData.passenger_count)).scalar() or 0
    
    # Dynamic Congested Stations (stations with ridership > 1000 in last 48 hours)
    cutoff_time = datetime.now() - timedelta(days=2)
    congested_stations_count = db.query(PassengerData.station_id)\
        .filter(PassengerData.passenger_count > 1000, PassengerData.created_at >= cutoff_time)\
        .distinct().count()

    # Peak station and peak hour
    peak_station_query = db.query(
        Station.station_name,
        func.sum(PassengerData.passenger_count).label("total_flow")
    ).join(PassengerData, Station.station_id == PassengerData.station_id)\
     .group_by(Station.station_name)\
     .order_by(text("total_flow DESC")).first()
     
    peak_station = peak_station_query[0] if peak_station_query else "N/A"

    peak_hour_query = db.query(
        func.extract("hour", PassengerData.travel_time).label("hr"),
        func.sum(PassengerData.passenger_count).label("total_flow")
    ).group_by(text("hr"))\
     .order_by(text("total_flow DESC")).first()

    peak_hour = f"{int(peak_hour_query[0])}:00" if peak_hour_query else "N/A"

    # Prediction metrics
    total_predictions = db.query(func.count(PredictionHistory.prediction_id)).scalar() or 0
    average_predicted_crowd = db.query(func.avg(PredictionHistory.predicted_passengers)).scalar() or 0
    maximum_predicted_crowd = db.query(func.max(PredictionHistory.predicted_passengers)).scalar() or 0
    minimum_predicted_crowd = db.query(func.min(PredictionHistory.predicted_passengers)).scalar() or 0

    high_alerts = db.query(func.count(PredictionHistory.prediction_id))\
        .filter(PredictionHistory.alert_severity == "High").scalar() or 0
    critical_alerts = db.query(func.count(PredictionHistory.prediction_id))\
        .filter(PredictionHistory.alert_severity == "Critical").scalar() or 0

    most_common_crowd_level_query = db.query(
        PredictionHistory.crowd_level,
        func.count(PredictionHistory.crowd_level).label("count")
    ).group_by(PredictionHistory.crowd_level)\
     .order_by(text("count DESC")).first()
     
    most_common_crowd_level = most_common_crowd_level_query[0] if most_common_crowd_level_query else "N/A"

    last_prediction = db.query(PredictionHistory)\
        .order_by(PredictionHistory.prediction_time.desc()).first()

    # MongoDB Alerts integration
    latest_alerts = []
    try:
        alerts = fetch_system_alerts(limit=5)
        for a in alerts:
            latest_alerts.append({
                "id": a.get("id"),
                "type": a.get("type"),
                "severity": a.get("severity"),
                "message": a.get("message"),
                "resolved": a.get("resolved"),
                "created_at": a.get("created_at").isoformat() if isinstance(a.get("created_at"), datetime) else str(a.get("created_at"))
            })
    except Exception as e:
        print(f"Failed to fetch alerts for dashboard: {e}")

    # Fetch last 5 predictions
    latest_predictions = []
    try:
        preds = db.query(PredictionHistory).order_by(PredictionHistory.prediction_time.desc()).limit(5).all()
        for p in preds:
            latest_predictions.append({
                "prediction_id": p.prediction_id,
                "from_station": p.from_station,
                "to_station": p.to_station,
                "predicted_passengers": p.predicted_passengers,
                "crowd_level": p.crowd_level,
                "prediction_time": p.prediction_time.isoformat() if p.prediction_time else None
            })
    except Exception as e:
        print(f"Failed to fetch predictions for dashboard: {e}")

    return {
        "total_stations": total_stations,
        "total_routes": total_routes,
        "total_trains": total_trains,
        "active_trains": active_trains,
        "delayed_trains": delayed_trains,
        "total_passengers": int(total_passengers),
        "congested_stations_count": congested_stations_count,
        "peak_station": peak_station,
        "peak_hour": peak_hour,
        "total_predictions": total_predictions,
        "average_predicted_crowd": round(average_predicted_crowd, 2),
        "maximum_predicted_crowd": maximum_predicted_crowd,
        "minimum_predicted_crowd": minimum_predicted_crowd,
        "high_alerts": high_alerts,
        "critical_alerts": critical_alerts,
        "most_common_crowd_level": most_common_crowd_level,
        "last_prediction_time": last_prediction.prediction_time if last_prediction else None,
        "latest_alerts": latest_alerts,
        "latest_predictions": latest_predictions,
        "ai_model": "HistGradientBoostingRegressor",
        "prediction_accuracy": 97.90
    }


def get_station_performance_metrics(db: Session):
    """
    Ridership flow aggregated per station for charts.
    """
    results = db.query(
        Station.station_name,
        func.sum(PassengerData.passenger_count).label("total_flow"),
        func.avg(PassengerData.passenger_count).label("avg_flow")
    ).join(PassengerData, Station.station_id == PassengerData.station_id)\
     .group_by(Station.station_name)\
     .order_by(text("total_flow DESC"))\
     .limit(10).all()
     
    return [{"station_name": r[0], "total_flow": int(r[1]), "avg_flow": round(r[2], 2)} for r in results]


def get_route_performance_metrics(db: Session):
    """
    Ridership flow aggregated per route line for line charts.
    """
    results = db.query(
        Route.route_name,
        Route.route_color,
        func.sum(PassengerData.passenger_count).label("total_flow")
    ).join(PassengerData, Route.route_id == PassengerData.route_id)\
     .group_by(Route.route_name, Route.route_color)\
     .order_by(text("total_flow DESC")).all()
     
    return [{"route_name": r[0], "route_color": r[1], "total_flow": int(r[2])} for r in results]


def get_daily_trends(db: Session):
    """
    Ridership trends for chart visualization.
    """
    results = db.query(
        PassengerData.travel_date,
        func.sum(PassengerData.passenger_count).label("total_flow")
    ).group_by(PassengerData.travel_date)\
     .order_by(PassengerData.travel_date.asc())\
     .limit(30).all()
     
    return [{"date": r[0].isoformat(), "total_flow": int(r[1])} for r in results]