from datetime import datetime
from app.ml.demand_predict import predict_demand
from app.services.frequency import recommend_frequency
STATIONS = [
    "King's Cross St. Pancras",
    "Waterloo",
    "Oxford Circus",
    "Victoria",
    "London Bridge",
    "Liverpool Street",
    "Stratford",
    "Bank & Monument",
    "Canary Wharf",
    "Paddington"
]

def get_dashboard(day_type="Weekday"):

    dashboard = []

    for station in STATIONS:

        try:

            demand = predict_demand(
                station=station,
                day_type=day_type
            )

            frequency = recommend_frequency(demand)

            dashboard.append({
                "station": station,
                "predicted_demand": demand,
                "recommended_frequency": frequency["recommended_frequency"],
                "additional_trains": frequency["additional_trains"],
                "status": frequency["status"]
            })

        except Exception:

            dashboard.append({
                "station": station,
                "predicted_demand": "Unavailable",
                "recommended_frequency": "-",
                "additional_trains": 0,
                "status": "No Data"
            })

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "day_type": day_type,
        "stations": dashboard
    }