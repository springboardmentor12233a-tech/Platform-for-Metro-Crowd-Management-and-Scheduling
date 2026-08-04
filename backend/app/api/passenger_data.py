from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.passenger_data import (
    PassengerDataCreate,
    PassengerDataUpdate,
    PassengerDataResponse
)
from app.services import passenger_data_service
from app.middleware.auth import require_roles

router = APIRouter(
    prefix="/passenger-data",
    tags=["Passenger Data"]
)


@router.post("/", response_model=PassengerDataResponse)
def create_passenger_data(
    data: PassengerDataCreate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    return passenger_data_service.create_passenger_data(db, data)


@router.get("/", response_model=list[PassengerDataResponse])
def get_all_passenger_data(
    station_id: Optional[int] = None,
    route_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    total, data = passenger_data_service.get_all_passenger_data(
        db, station_id, route_id, start_date, end_date, page, limit
    )
    return data


@router.get("/{passenger_id}", response_model=PassengerDataResponse)
def get_passenger_data(
    passenger_id: int,
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    passenger = passenger_data_service.get_passenger_data_by_id(
        db,
        passenger_id
    )

    if not passenger:
        raise HTTPException(
            status_code=404,
            detail="Passenger data not found"
        )

    return passenger


@router.put("/{passenger_id}", response_model=PassengerDataResponse)
def update_passenger_data(
    passenger_id: int,
    data: PassengerDataUpdate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    updated = passenger_data_service.update_passenger_data(db, passenger_id, data)
    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Passenger data not found"
        )
    return updated


@router.delete("/{passenger_id}")
def delete_passenger_data(
    passenger_id: int,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    deleted = passenger_data_service.delete_passenger_data(db, passenger_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Passenger data not found"
        )
    return {"message": "Passenger data deleted successfully"}