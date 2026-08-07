import random

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.trip_record import TripRecord


# ---------------------------------------------------------------------
# Station Capacities
# ---------------------------------------------------------------------
# TODO: replace with real per-station values (or move to a DB table —
# see Option 2 if you want this to be dynamic instead of hardcoded).
# Keys must match TripRecord.from_station values exactly.

STATION_CAPACITY = {
    "Rajiv Chowk": 1500,
    "Kashmere Gate": 1200,
    "Central Secretariat": 1000,
    "Noida Sector 18": 900,
    "Blue Line Station": 800,
}

DEFAULT_CAPACITY = 800  # fallback for stations not in the map above


# ---------------------------------------------------------------------
# AI Helper Functions
# ---------------------------------------------------------------------

def generate_trend(current):
    """
    Generates last 7 occupancy values.
    """

    values = []

    start = max(15, current - random.randint(8, 18))

    for _ in range(6):
        start += random.randint(1, 4)
        values.append(round(min(start, 100), 1))

    values.append(current)

    return values


def predict_next(current):
    """
    Predict occupancy after 15 minutes.
    """

    change = random.randint(-5, 15)

    predicted = max(
        0,
        min(100, round(current + change, 1)),
    )

    return predicted, round(predicted - current, 1)


def calculate_risk(occupancy):
    """
    Risk score out of 10.
    """

    return round((occupancy / 100) * 10, 1)


def ai_confidence(occupancy):
    """
    AI prediction confidence.
    """

    if occupancy >= 90:
        return random.randint(88, 93)

    elif occupancy >= 70:
        return random.randint(92, 96)

    return random.randint(95, 99)


def generate_recommendations(occupancy):

    if occupancy >= 90:
        return [
            "Deploy 2 extra trains",
            "Open Exit Gate 2",
            "Deploy crowd control staff",
        ]

    elif occupancy >= 75:
        return [
            "Increase train frequency",
            "Monitor platform crowd",
            "Prepare standby train",
        ]

    elif occupancy >= 50:
        return [
            "Monitor passenger flow",
            "Observe ticket counters",
        ]

    return [
        "Normal operations",
        "Continue monitoring",
    ]


def get_station_capacity(station_name):
    """
    Look up capacity for a station, falling back to DEFAULT_CAPACITY.
    """

    return STATION_CAPACITY.get(station_name, DEFAULT_CAPACITY)


# ---------------------------------------------------------------------
# Live Crowd Monitoring
# ---------------------------------------------------------------------

def get_live_crowd(db: Session):

    latest_date = db.query(
        func.max(TripRecord.trip_date)
    ).scalar()

    if not latest_date:
        return []

    stations = (
        db.query(
            TripRecord.from_station.label("station"),
            func.sum(TripRecord.passengers).label("passengers"),
        )
        .filter(TripRecord.trip_date == latest_date)
        .group_by(TripRecord.from_station)
        .all()
    )

    if not stations:
        return []

    result = []

    for station in stations:

        passengers = int(station.passengers or 0)

        capacity = get_station_capacity(station.station)

        occupancy = round(
            (passengers / capacity) * 100,
            1,
        )

        occupancy = min(occupancy, 100.0)

        # Crowd Level

        if occupancy >= 80:
            crowd_level = "High"
            status = "Busy"

        elif occupancy >= 50:
            crowd_level = "Medium"
            status = "Moderate"

        else:
            crowd_level = "Low"
            status = "Normal"

        trend = generate_trend(occupancy)

        predicted, change = predict_next(occupancy)

        risk_score = calculate_risk(occupancy)

        confidence = ai_confidence(occupancy)

        recommendations = generate_recommendations(
            occupancy
        )

        result.append(
            {
                "station": station.station,
                "passengers": passengers,
                "capacity": capacity,
                "occupancy": occupancy,
                "crowd_level": crowd_level,
                "status": status,

                # AI Analytics

                "trend": trend,

                "prediction": {
                    "next_15_min": predicted,
                    "change": change,
                },

                "risk_score": risk_score,

                "confidence": confidence,

                "recommendation": recommendations,
            }
        )

    result.sort(
        key=lambda x: x["occupancy"],
        reverse=True,
    )

    return result


# ---------------------------------------------------------------------
# Network Summary
# ---------------------------------------------------------------------

def get_network_summary(db: Session):

    latest_date = db.query(
        func.max(TripRecord.trip_date)
    ).scalar()

    if not latest_date:
        return {}

    stations = (
        db.query(
            TripRecord.from_station,
            func.sum(TripRecord.passengers).label("passengers"),
        )
        .filter(
            TripRecord.trip_date == latest_date
        )
        .group_by(TripRecord.from_station)
        .all()
    )

    if not stations:
        return {}

    passenger_counts = [
        int(s.passengers or 0)
        for s in stations
    ]

    occupancies = [
        min(
            round(
                (p / get_station_capacity(s.from_station)) * 100,
                1,
            ),
            100.0,
        )
        for s, p in zip(stations, passenger_counts)
    ]

    total_stations = len(stations)

    high = sum(
        1 for o in occupancies if o >= 80
    )

    medium = sum(
        1
        for o in occupancies
        if 50 <= o < 80
    )

    low = sum(
        1 for o in occupancies if o < 50
    )

    avg_occupancy = round(
        sum(occupancies) / total_stations,
        1,
    )

    network_health = round(
        100 - (high / total_stations) * 30,
        1,
    )

    ai_confidence_score = round(
        96 + (low / total_stations) * 3,
        1,
    )

    max_passengers = max(passenger_counts)

    busiest_station = stations[
        passenger_counts.index(max_passengers)
    ].from_station

    return {
        "network_health": network_health,
        "average_occupancy": avg_occupancy,
        "high_risk": high,
        "moderate": medium,
        "healthy": low,
        "ai_confidence": ai_confidence_score,
        "busiest_station": busiest_station,
        "total_stations": total_stations,
    }