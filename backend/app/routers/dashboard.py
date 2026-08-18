from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.permissions import require_roles

from app.services.dashboard_service import (
    get_dashboard_summary,
    get_busiest_stations,
    get_passenger_trend,
    get_ticket_distribution,
    get_revenue_analysis,
    get_top_routes,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
                "Analyst",
                "Member",
            )
        )
    ],
)


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
):
    return get_dashboard_summary(db)


@router.get("/busiest-stations")
def busiest_stations(
    db: Session = Depends(get_db),
):
    return get_busiest_stations(db)


@router.get("/passenger-trend")
def passenger_trend(
    db: Session = Depends(get_db),
):
    return get_passenger_trend(db)


@router.get("/ticket-distribution")
def ticket_distribution(
    db: Session = Depends(get_db),
):
    return get_ticket_distribution(db)


@router.get("/revenue-analysis")
def revenue_analysis(
    db: Session = Depends(get_db),
):
    return get_revenue_analysis(db)


@router.get("/top-routes")
def top_routes(
    db: Session = Depends(get_db),
):
    return get_top_routes(db)


# ============================================================
# RECENT OPERATIONAL ALERTS
# ============================================================

@router.get("/recent-alerts")
def recent_alerts(
    db: Session = Depends(get_db),
):
    stations = get_busiest_stations(db)

    alerts = []

    for station in stations:
        station_name = (
            station.get("station_name")
            or station.get("station")
            or station.get("name")
            or "Unknown Station"
        )

        passengers = (
            station.get("passengers")
            or station.get("total_passengers")
            or 0
        )

        occupancy = station.get("occupancy")

        if occupancy is None:
            occupancy = min(
                round((passengers / 10000) * 100),
                100,
            )

        # Critical
        if occupancy >= 80:
            alerts.append({
                "station": station_name,
                "severity": "Critical",
                "occupancy": occupancy,
                "passengers": passengers,
                "message": (
                    f"High crowd density detected at "
                    f"{station_name}."
                ),
            })

        # Warning
        elif occupancy >= 60:
            alerts.append({
                "station": station_name,
                "severity": "Warning",
                "occupancy": occupancy,
                "passengers": passengers,
                "message": (
                    f"Passenger density increasing at "
                    f"{station_name}."
                ),
            })

    return alerts[:10]