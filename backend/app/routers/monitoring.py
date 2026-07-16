from fastapi import APIRouter, Depends
from datetime import datetime

from app.services.prediction import predict_crowd
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/monitoring", tags=["Real-Time Monitoring"])

# Same monitored stations as the frontend dashboard
MONITORED_STATIONS = [
    {"name": "Rajiv Chowk", "line": "Blue line"},
    {"name": "Kashmere Gate", "line": "Red line"},
    {"name": "Central Secretariat", "line": "Yellow line"},
    {"name": "Hauz Khas", "line": "Magenta line"},
    {"name": "Dwarka Sector 21", "line": "Orange line"},
    {"name": "New Delhi", "line": "Yellow line"},
]


def classify_status(passengers: float) -> str:
    if passengers >= 1400:
        return "Critical"
    if passengers >= 900:
        return "High"
    if passengers >= 400:
        return "Moderate"
    return "Low"


@router.get("/status")
def get_live_status(user=Depends(get_current_user)):
    """
    Returns current real-time status for all monitored stations,
    using the actual current hour and day of week.
    Also returns a list of active overcrowding alerts (stations at Critical level).
    """
    now = datetime.now()
    current_hour = now.hour
    current_day = now.strftime("%A")

    stations_status = []
    alerts = []

    for station in MONITORED_STATIONS:
        result = predict_crowd(
            station_name=station["name"],
            line=station["line"],
            hour=current_hour,
            day_of_week=current_day,
        )
        passengers = result["predicted_passengers"]
        status = classify_status(passengers)

        station_data = {
            "station": station["name"],
            "line": station["line"],
            "predicted_passengers": passengers,
            "status": status,
        }
        stations_status.append(station_data)

        if status == "Critical":
            alerts.append({
                "station": station["name"],
                "message": f"{station['name']} is at critical crowd levels ({passengers:.0f} passengers predicted)",
            })

    return {
        "timestamp": now.isoformat(),
        "current_hour": current_hour,
        "current_day": current_day,
        "stations": stations_status,
        "alerts": alerts,
    }