from fastapi import APIRouter, Depends

from app.auth.permissions import require_roles
from app.services.alert_service import get_alerts

router = APIRouter(
    prefix="/alerts",
    tags=["AI Alerts"],
    dependencies=[
        Depends(require_roles("Admin", "Operator", "Analyst"))
    ],
)


@router.get("/")
def alerts():
    return get_alerts()