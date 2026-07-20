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

def generate_report(day_type="Weekday"):

    report = []

    summary = {
        "High": 0,
        "Medium": 0,
        "Low": 0
    }

    for station in STATIONS:

        try:

            demand = predict_demand(
                station=station,
                day_type=day_type
            )

            frequency = recommend_frequency(demand)

            summary[demand] += 1

            report.append({

                "station": station,

                "predicted_demand": demand,

                "recommended_frequency":
                    frequency["recommended_frequency"],

                "additional_trains":
                    frequency["additional_trains"],

                "status":
                    frequency["status"]

            })

        except Exception:

            report.append({

                "station": station,

                "predicted_demand": "Unavailable",

                "recommended_frequency": "-",

                "additional_trains": 0,

                "status": "No Data"

            })

    return {

        "summary": {

            "total_stations": len(STATIONS),

            "high_demand": summary["High"],

            "medium_demand": summary["Medium"],

            "low_demand": summary["Low"]

        },

        "stations": report

    }