from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.trip_record import TripRecord
from app.models.station import Station

# Dashboard Summary

def get_dashboard_summary(db: Session):
    total_passengers = (
        db.query(func.sum(TripRecord.passengers))
        .scalar()
    ) or 0

    total_trips = (
        db.query(func.count(TripRecord.id))
        .scalar()
    ) or 0

    total_stations = (
        db.query(func.count(Station.id))
        .scalar()
    ) or 0

    total_revenue = (
        db.query(func.sum(TripRecord.fare))
        .scalar()
    ) or 0

    return {
        "total_passengers": int(total_passengers),
        "total_trips": int(total_trips),
        "total_stations": int(total_stations),
        "total_revenue": round(float(total_revenue), 2),
    }

# Top 5 Busiest Stations

def get_busiest_stations(db: Session):
    stations = (
        db.query(
            TripRecord.from_station,
            func.sum(TripRecord.passengers).label("total_passengers"),
        )
        .group_by(TripRecord.from_station)
        .order_by(func.sum(TripRecord.passengers).desc())
        .limit(5)
        .all()
    )

    return [
        {
            "station": station,
            "passengers": int(passengers),
        }
        for station, passengers in stations
    ]


# Passenger Trend (Monthly)
def get_passenger_trend(db: Session):
    month = func.to_char(
        func.to_date(TripRecord.trip_date, "YYYY-MM-DD"),
        "YYYY-MM",
    )

    trend = (
        db.query(
            month.label("month"),
            func.sum(TripRecord.passengers).label("total_passengers"),
        )
        .group_by(month)
        .order_by(month)
        .all()
    )

    return [
        {
            "date": m,
            "passengers": int(passengers),
        }
        for m, passengers in trend
    ]

# Ticket Type Distribution

def get_ticket_distribution(db: Session):
    ticket_data = (
        db.query(
            TripRecord.ticket_type,
            func.count(TripRecord.id).label("count"),
        )
        .group_by(TripRecord.ticket_type)
        .all()
    )

    return [
        {
            "name": ticket_type if ticket_type else "Unknown",
            "value": int(count),
        }
        for ticket_type, count in ticket_data
    ]


# Revenue Analysis (Monthly)

def get_revenue_analysis(db: Session):
    month = func.to_char(
        func.to_date(TripRecord.trip_date, "YYYY-MM-DD"),
        "YYYY-MM",
    )

    revenue = (
        db.query(
            month.label("month"),
            func.sum(TripRecord.fare).label("revenue"),
        )
        .group_by(month)
        .order_by(month)
        .all()
    )

    return [
        {
            "date": m,
            "revenue": round(float(total), 2),
        }
        for m, total in revenue
    ]

# Top Routes

def get_top_routes(db: Session):
    routes = (
        db.query(
            TripRecord.from_station,
            TripRecord.to_station,
            func.sum(TripRecord.passengers).label("total_passengers"),
        )
        .group_by(
            TripRecord.from_station,
            TripRecord.to_station,
        )
        .order_by(
            func.sum(TripRecord.passengers).desc()
        )
        .limit(10)
        .all()
    )

    return [
        {
            "from_station": from_station,
            "to_station": to_station,
            "passengers": int(passengers),
        }
        for from_station, to_station, passengers in routes
    ]