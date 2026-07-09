from datetime import date
from typing import Iterable

from sqlalchemy import desc, func, or_
from sqlalchemy.orm import Session

from app.models import PassengerFlow, Station


def _status_from_percentage(percentage: float) -> str:
    if percentage >= 90:
        return "Overcrowded"
    if percentage >= 70:
        return "High"
    if percentage >= 40:
        return "Moderate"
    return "Low"


def get_latest_date(db: Session) -> date | None:
    return db.query(func.max(PassengerFlow.travel_date)).scalar()


def get_summary(db: Session) -> dict:
    total_passengers = int(db.query(func.coalesce(func.sum(PassengerFlow.passengers), 0)).scalar() or 0)
    total_trips = int(db.query(func.count(PassengerFlow.id)).scalar() or 0)
    total_stations = int(db.query(func.count(Station.id)).scalar() or 0)
    average_fare = float(db.query(func.coalesce(func.avg(PassengerFlow.fare), 0)).scalar() or 0)
    latest_date = get_latest_date(db)

    busiest = (
        db.query(Station.name, func.sum(PassengerFlow.passengers).label("total"))
        .join(PassengerFlow, PassengerFlow.from_station_id == Station.id)
        .group_by(Station.name)
        .order_by(desc("total"))
        .first()
    )
    busiest_station = busiest.name if busiest else "No data"

    remarks_split = [
        {"label": label or "Unknown", "value": float(value or 0)}
        for label, value in db.query(PassengerFlow.remarks, func.sum(PassengerFlow.passengers)).group_by(PassengerFlow.remarks).all()
    ]

    ticket_type_split = [
        {"label": label or "Unknown", "value": float(value or 0)}
        for label, value in db.query(PassengerFlow.ticket_type, func.sum(PassengerFlow.passengers)).group_by(PassengerFlow.ticket_type).all()
    ]

    cards = [
        {"label": "Total passengers", "value": f"{total_passengers:,}", "helper": "Imported passenger records"},
        {"label": "Total trips", "value": f"{total_trips:,}", "helper": "Trips loaded into backend"},
        {"label": "Stations", "value": f"{total_stations:,}", "helper": "Unique stations monitored"},
        {"label": "Busiest station", "value": busiest_station, "helper": "Based on outbound passenger volume"},
    ]

    return {
        "total_passengers": total_passengers,
        "total_trips": total_trips,
        "total_stations": total_stations,
        "busiest_station": busiest_station,
        "latest_date": latest_date,
        "average_fare": round(average_fare, 2),
        "cards": cards,
        "remarks_split": remarks_split,
        "ticket_type_split": ticket_type_split,
    }


def get_station_crowd(db: Session, target_date: date | None = None, limit: int = 20) -> list[dict]:
    active_date = target_date or get_latest_date(db)
    if active_date is None:
        return []

    stations = db.query(Station).all()
    result = []
    for station in stations:
        inbound = (
            db.query(func.coalesce(func.sum(PassengerFlow.passengers), 0))
            .filter(PassengerFlow.travel_date == active_date, PassengerFlow.to_station_id == station.id)
            .scalar()
            or 0
        )
        outbound = (
            db.query(func.coalesce(func.sum(PassengerFlow.passengers), 0))
            .filter(PassengerFlow.travel_date == active_date, PassengerFlow.from_station_id == station.id)
            .scalar()
            or 0
        )
        current_load = int(inbound + outbound)
        crowd_percentage = round((current_load / station.capacity) * 100, 2) if station.capacity else 0
        result.append(
            {
                "station_id": station.id,
                "station_name": station.name,
                "capacity": station.capacity,
                "inbound_passengers": int(inbound),
                "outbound_passengers": int(outbound),
                "current_load": current_load,
                "crowd_percentage": crowd_percentage,
                "congestion_status": _status_from_percentage(crowd_percentage),
            }
        )

    result.sort(key=lambda item: item["current_load"], reverse=True)
    return result[:limit]


def get_passenger_trend(db: Session, days: int = 30) -> list[dict]:
    rows = (
        db.query(PassengerFlow.travel_date, func.sum(PassengerFlow.passengers).label("passengers"))
        .group_by(PassengerFlow.travel_date)
        .order_by(desc(PassengerFlow.travel_date))
        .limit(days)
        .all()
    )
    rows = list(reversed(rows))
    return [{"date": row.travel_date, "passengers": int(row.passengers or 0)} for row in rows]


def get_heatmap(db: Session, limit: int = 12) -> list[dict]:
    station_crowd = get_station_crowd(db, limit=limit)
    return [
        {
            "station_name": item["station_name"],
            "load": item["current_load"],
            "crowd_percentage": item["crowd_percentage"],
            "congestion_status": item["congestion_status"],
        }
        for item in station_crowd
    ]


def search_stations(db: Session, query: str | None = None) -> Iterable[Station]:
    base = db.query(Station).order_by(Station.name)
    if query:
        base = base.filter(Station.name.ilike(f"%{query}%"))
    return base.all()
