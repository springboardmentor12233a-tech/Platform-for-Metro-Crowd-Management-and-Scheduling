from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import StationOut
from app.services.crowd_service import search_stations

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("", response_model=list[StationOut])
def list_stations(
    q: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_stations(db, q)
