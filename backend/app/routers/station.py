from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.station import Station
from app.schemas.station import StationCreate
from app.auth.dependencies import require_roles

from app.services.station_service import (
    create_station,
    get_all_stations,
    get_station,
    update_station,
    delete_station,
)

router = APIRouter(
    prefix="/stations",
    tags=["Stations"],
)


# -------------------------
# Create Station (Admin Only)
# -------------------------
@router.post("/")
def add_station(
    request: StationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Admin")),
):
    station = Station(
        station_name=request.station_name,
        line=request.line,
        capacity=request.capacity,
    )

    return create_station(db, station)


# -------------------------
# Get All Stations
# Admin | Operator | Analyst
# -------------------------
@router.get("/")
def all_stations(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):
    return get_all_stations(db)


# -------------------------
# Get Station By ID
# Admin | Operator | Analyst
# -------------------------
@router.get("/{station_id}")
def station_by_id(
    station_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
):
    station = get_station(db, station_id)

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


# -------------------------
# Update Station (Admin Only)
# -------------------------
@router.put("/{station_id}")
def edit_station(
    station_id: int,
    request: StationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Admin")),
):
    station = update_station(
        db,
        station_id,
        request,
    )

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


# -------------------------
# Delete Station (Admin Only)
# -------------------------
@router.delete("/{station_id}")
def remove_station(
    station_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Admin")),
):
    station = delete_station(
        db,
        station_id,
    )

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return {
        "message": "Station deleted successfully"
    }