from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles
from app.services.alert_service import get_alerts

router = APIRouter(
    prefix="/alerts",
    tags=["AI Alerts"],
)


@router.get("/")
def alerts(
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):
    return get_alerts()