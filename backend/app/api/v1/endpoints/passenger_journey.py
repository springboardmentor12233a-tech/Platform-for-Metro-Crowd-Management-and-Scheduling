from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.passenger_journey import (
    PassengerJourneyCreate,
    PassengerJourneyUpdate,
    PassengerJourneyResponse,
)
from app.services.passenger_journey import (
    PassengerJourneyService,
)

router = APIRouter()


@router.post(
    "/",
    response_model=PassengerJourneyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_passenger_journey(
    journey: PassengerJourneyCreate,
    db: Session = Depends(get_db),
):
    return PassengerJourneyService.create_passenger_journey(
        db=db,
        journey=journey,
    )


@router.get(
    "/",
    response_model=List[PassengerJourneyResponse],
)
def get_all_passenger_journeys(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return PassengerJourneyService.get_all_passenger_journeys(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{journey_id}",
    response_model=PassengerJourneyResponse,
)
def get_passenger_journey(
    journey_id: str,
    db: Session = Depends(get_db),
):
    journey = PassengerJourneyService.get_passenger_journey(
        db=db,
        journey_id=journey_id,
    )

    if journey is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passenger journey not found",
        )

    return journey


@router.put(
    "/{journey_id}",
    response_model=PassengerJourneyResponse,
)
def update_passenger_journey(
    journey_id: str,
    journey: PassengerJourneyUpdate,
    db: Session = Depends(get_db),
):
    updated = PassengerJourneyService.update_passenger_journey(
        db=db,
        journey_id=journey_id,
        journey=journey,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passenger journey not found",
        )

    return updated


@router.delete(
    "/{journey_id}",
    response_model=PassengerJourneyResponse,
)
def delete_passenger_journey(
    journey_id: str,
    db: Session = Depends(get_db),
):
    deleted = PassengerJourneyService.delete_passenger_journey(
        db=db,
        journey_id=journey_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passenger journey not found",
        )

    return deleted