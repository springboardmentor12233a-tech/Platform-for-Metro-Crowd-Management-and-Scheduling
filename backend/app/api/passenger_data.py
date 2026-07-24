from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.passenger_data import (
    PassengerDataCreate,
    PassengerDataResponse
)
from app.services import passenger_data_service

router = APIRouter(
    prefix="/passenger-data",
    tags=["Passenger Data"]
)


@router.post("/", response_model=PassengerDataResponse)
def create_passenger_data(
    data: PassengerDataCreate,
    db: Session = Depends(get_db)
):
    return passenger_data_service.create_passenger_data(db, data)


@router.get("/", response_model=list[PassengerDataResponse])
def get_all_passenger_data(db: Session = Depends(get_db)):
    return passenger_data_service.get_all_passenger_data(db)


@router.get("/{passenger_id}", response_model=PassengerDataResponse)
def get_passenger_data(
    passenger_id: int,
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