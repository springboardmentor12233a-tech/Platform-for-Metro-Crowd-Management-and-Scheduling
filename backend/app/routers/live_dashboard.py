from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.permissions import require_roles
from app.services.live_dashboard_service import get_live_dashboard

router = APIRouter(
    prefix="/live-dashboard",
    tags=["Live Dashboard"],
    dependencies=[
        Depends(require_roles("Admin", "Operator", "Analyst"))
    ],
)


@router.get("/")
def live_dashboard(db: Session = Depends(get_db)):
    return get_live_dashboard(db)