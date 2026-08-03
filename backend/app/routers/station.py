from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.station import StationCreate
from app.auth.permissions import require_roles

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

# -------------------------------------------------
# Get All Stations
# -------------------------------------------------

@router.get(
    "/",
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
def all_stations(
    db: Session = Depends(get_db),
):
    return get_all_stations(db)


# -------------------------------------------------
# Get Station By ID
# -------------------------------------------------

@router.get(
    "/{station_id}",
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
def station_by_id(
    station_id: int,
    db: Session = Depends(get_db),
):
    station = get_station(db, station_id)

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station


# -------------------------------------------------
# Create Station
# -------------------------------------------------

@router.post(
    "/",
    dependencies=[
        Depends(
            require_roles("Admin")
        )
    ],
)
def add_station(
    station: StationCreate,
    db: Session = Depends(get_db),
):
    return create_station(db, station)


# -------------------------------------------------
# Update Station
# -------------------------------------------------

@router.put(
    "/{station_id}",
    dependencies=[
        Depends(
            require_roles("Admin")
        )
    ],
)
def edit_station(
    station_id: int,
    station: StationCreate,
    db: Session = Depends(get_db),
):
    updated = update_station(
        db,
        station_id,
        station,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return updated


# -------------------------------------------------
# Delete Station
# -------------------------------------------------

@router.delete(
    "/{station_id}",
    dependencies=[
        Depends(
            require_roles("Admin")
        )
    ],
)
def remove_station(
    station_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_station(
        db,
        station_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return {
        "message": "Station deleted successfully"
    }