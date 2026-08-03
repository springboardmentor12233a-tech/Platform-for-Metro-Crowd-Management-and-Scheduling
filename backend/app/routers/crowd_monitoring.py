from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.permissions import require_roles

from app.services.crowd_monitoring_service import (
    get_live_crowd,
    get_network_summary,
)

router = APIRouter(
    prefix="/crowd-monitoring",
    tags=["Crowd Monitoring"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
                "Analyst",
            )
        )
    ],
)


# ------------------------------------
# Live Crowd Monitoring
# Admin | Operator | Analyst
# ------------------------------------
@router.get("/live")
def live_crowd_monitoring(
    db: Session = Depends(get_db),
):
    """
    Returns real-time crowd monitoring data
    for all metro stations.
    """
    return get_live_crowd(db)


# ------------------------------------
# AI Network Summary
# Admin | Operator | Analyst
# ------------------------------------
@router.get("/summary")
def crowd_summary(
    db: Session = Depends(get_db),
):
    """
    Returns AI-generated network summary.
    """
    return get_network_summary(db)