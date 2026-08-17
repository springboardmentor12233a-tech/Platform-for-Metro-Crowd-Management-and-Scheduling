from datetime import timedelta

import numpy as np
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.models import PassengerFlow, Station
from app.services.crowd_service import get_latest_date, get_station_crowd

try:
    from sklearn.linear_model import LinearRegression
except Exception:  # pragma: no cover - fallback keeps demo running even if sklearn is unavailable
    LinearRegression = None


def _level(value: int, avg: float) -> str:
    if value >= avg * 1.20:
        return "High"
    if value >= avg * 0.90:
        return "Moderate"
    return "Low"


def get_demand_forecast(db: Session, days: int = 7) -> dict:
    rows = (
        db.query(PassengerFlow.travel_date, func.sum(PassengerFlow.passengers).label("passengers"))
        .group_by(PassengerFlow.travel_date)
        .order_by(PassengerFlow.travel_date)
        .all()
    )
    if not rows:
        return {"forecast": [], "station_predictions": [], "model_name": "No data", "model_note": "Dataset is empty."}

    y = np.array([float(row.passengers or 0) for row in rows])
    x = np.arange(len(y)).reshape(-1, 1)
    avg = float(y.mean()) if len(y) else 0

    if LinearRegression and len(y) >= 2:
        model = LinearRegression()
        model.fit(x, y)
        future_x = np.arange(len(y), len(y) + days).reshape(-1, 1)
        predictions = model.predict(future_x)
        model_name = "Scikit-learn LinearRegression"
        model_note = "Forecast trained from daily passenger demand using imported Delhi Metro ridership records."
    else:
        predictions = np.array([avg for _ in range(days)])
        model_name = "Moving average fallback"
        model_note = "Fallback forecast generated from average passenger demand."

    latest = rows[-1].travel_date
    forecast = []
    for index, pred in enumerate(predictions, start=1):
        predicted = max(0, int(round(float(pred))))
        confidence = max(0.72, min(0.94, 0.90 - (index * 0.015)))
        forecast.append(
            {
                "forecast_date": latest + timedelta(days=index),
                "predicted_passengers": predicted,
                "demand_level": _level(predicted, avg),
                "confidence": round(confidence, 2),
            }
        )

    station_predictions = []
    for item in get_station_crowd(db, limit=8):
        predicted_load = int(round(item["current_load"] * 1.12))
        risk = item["congestion_status"]
        if risk in ["High", "Overcrowded"]:
            recommendation = "Increase frequency, prepare crowd control staff, and trigger active monitoring."
        elif risk == "Moderate":
            recommendation = "Keep standby train capacity and continue frequent station checks."
        else:
            recommendation = "Maintain normal monitoring and review during peak hours."
        station_predictions.append(
            {
                "station_name": item["station_name"],
                "predicted_load": predicted_load,
                "risk_level": risk,
                "recommendation": recommendation,
            }
        )

    return {
        "forecast": forecast,
        "station_predictions": station_predictions,
        "model_name": model_name,
        "model_note": model_note,
    }


def get_traffic_report(db: Session) -> dict:
    total = int(db.query(func.coalesce(func.sum(PassengerFlow.passengers), 0)).scalar() or 0)
    busiest = (
        db.query(Station.name, func.sum(PassengerFlow.passengers).label("total"))
        .join(PassengerFlow, PassengerFlow.from_station_id == Station.id)
        .group_by(Station.name)
        .order_by(desc("total"))
        .first()
    )
    remarks_rows = db.query(PassengerFlow.remarks, func.sum(PassengerFlow.passengers)).group_by(PassengerFlow.remarks).all()
    report_points = [{"label": label or "Unknown", "value": float(value or 0)} for label, value in remarks_rows]
    peak_context = max(report_points, key=lambda item: item["value"])["label"] if report_points else "No data"

    insights = [
        f"Busiest station by source traffic is {busiest.name if busiest else 'No data'}, which should be prioritized during peak monitoring.",
        f"Highest passenger context in the imported data is {peak_context}, useful for demand-based frequency planning.",
        "Crowd load is calculated using station inbound and outbound passenger counts from the ridership dataset.",
        "Forecast outputs can support scheduling decisions and early congestion response before overcrowding occurs.",
    ]
    return {
        "total_passengers": total,
        "peak_context": peak_context,
        "busiest_station": busiest.name if busiest else "No data",
        "report_points": report_points,
        "insights": insights,
    }
