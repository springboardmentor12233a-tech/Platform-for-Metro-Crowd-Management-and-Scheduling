from sqlalchemy.orm import Session

from app.models.trip_record import TripRecord


def get_forecast_dashboard(db: Session):

    trips = db.query(TripRecord).all()

    total = sum(t.passengers for t in trips)

    forecast_data = [
        {
            "day": "Mon",
            "historical": int(total * 0.13),
            "predicted": int(total * 0.14),
            "predictedPassengers": int(total * 0.14),
            "growthRate": 8.4,
            "accuracy": 97.8,
            "confidence": 98,
        },
        {
            "day": "Tue",
            "historical": int(total * 0.14),
            "predicted": int(total * 0.15),
            "predictedPassengers": int(total * 0.15),
            "growthRate": 9.2,
            "accuracy": 97.4,
            "confidence": 97,
        },
        {
            "day": "Wed",
            "historical": int(total * 0.15),
            "predicted": int(total * 0.16),
            "predictedPassengers": int(total * 0.16),
            "growthRate": 9.8,
            "accuracy": 98.1,
            "confidence": 98,
        },
        {
            "day": "Thu",
            "historical": int(total * 0.16),
            "predicted": int(total * 0.17),
            "predictedPassengers": int(total * 0.17),
            "growthRate": 10.1,
            "accuracy": 97.9,
            "confidence": 98,
        },
        {
            "day": "Fri",
            "historical": int(total * 0.17),
            "predicted": int(total * 0.18),
            "predictedPassengers": int(total * 0.18),
            "growthRate": 11.2,
            "accuracy": 97.5,
            "confidence": 97,
        },
        {
            "day": "Sat",
            "historical": int(total * 0.11),
            "predicted": int(total * 0.12),
            "predictedPassengers": int(total * 0.12),
            "growthRate": 6.2,
            "accuracy": 96.8,
            "confidence": 96,
        },
        {
            "day": "Sun",
            "historical": int(total * 0.10),
            "predicted": int(total * 0.11),
            "predictedPassengers": int(total * 0.11),
            "growthRate": 5.7,
            "accuracy": 96.3,
            "confidence": 95,
        },
    ]

    hourly = [
        {"hour": "06", "demand": 28},
        {"hour": "07", "demand": 42},
        {"hour": "08", "demand": 75},
        {"hour": "09", "demand": 92},
        {"hour": "10", "demand": 69},
        {"hour": "11", "demand": 56},
        {"hour": "12", "demand": 61},
        {"hour": "13", "demand": 63},
        {"hour": "14", "demand": 59},
        {"hour": "15", "demand": 68},
        {"hour": "16", "demand": 82},
        {"hour": "17", "demand": 97},
    ]

    routes = [
        {
            "route": "Blue Line",
            "current": 45200,
            "forecast": 50800,
            "growth": 12,
            "capacity": 91,
            "status": "Critical",
        },
        {
            "route": "Yellow Line",
            "current": 39100,
            "forecast": 42700,
            "growth": 9,
            "capacity": 82,
            "status": "High",
        },
        {
            "route": "Red Line",
            "current": 28000,
            "forecast": 30400,
            "growth": 8,
            "capacity": 72,
            "status": "Moderate",
        },
        {
            "route": "Green Line",
            "current": 18100,
            "forecast": 19300,
            "growth": 6,
            "capacity": 58,
            "status": "Low",
        },
    ]

    return {
        "forecastData": forecast_data,
        "hourlyDemand": hourly,
        "routes": routes,
    }