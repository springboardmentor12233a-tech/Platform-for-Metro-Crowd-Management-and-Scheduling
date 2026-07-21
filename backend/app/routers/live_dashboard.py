from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.live_dashboard_service import get_live_dashboard

router = APIRouter(
    prefix="/live-dashboard",
    tags=["Live Dashboard"],
)


@router.get("/")
def live_dashboard(db: Session = Depends(get_db)):
    return get_live_dashboard(db)