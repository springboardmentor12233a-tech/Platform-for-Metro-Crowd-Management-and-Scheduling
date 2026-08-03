from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import require_roles

from app.schemas.activity_analytics_schema import AnalyticsResponse
from app.services.activity_analytics_service import (
    get_dashboard_analytics,
)

router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Analytics"],
)


@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
)
def analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Admin")),
):
    return get_dashboard_analytics(db)