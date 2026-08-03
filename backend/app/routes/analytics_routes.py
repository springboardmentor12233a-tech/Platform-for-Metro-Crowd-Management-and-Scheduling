from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import AnalyticsReport
from app.services.analytics_service import get_analytics_report

router = APIRouter(prefix="/analytics", tags=["Milestone 3 - Analytics"])


@router.get("/report", response_model=AnalyticsReport)
def report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_analytics_report(db)
