from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import require_roles

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
)


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_dashboard_summary(db)


@router.get("/busiest-stations")
def busiest_stations(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_busiest_stations(db)


@router.get("/passenger-trend")
def passenger_trend(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_passenger_trend(db)


@router.get("/ticket-distribution")
def ticket_distribution(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_ticket_distribution(db)


@router.get("/revenue-analysis")
def revenue_analysis(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_revenue_analysis(db)


@router.get("/top-routes")
def top_routes(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
            "Member",
        )
    ),
):
    return get_top_routes(db)