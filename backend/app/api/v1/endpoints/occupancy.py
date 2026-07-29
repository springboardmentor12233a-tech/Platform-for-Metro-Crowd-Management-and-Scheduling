from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.occupancy import (
    OccupancyCreate,
    OccupancyUpdate,
    OccupancyResponse,
)
from app.services.occupancy import OccupancyService

router = APIRouter()


@router.post(
    "/",
    response_model=OccupancyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_occupancy(
    occupancy: OccupancyCreate,
    db: Session = Depends(get_db),
):
    return OccupancyService.create_occupancy(
        db=db,
        occupancy=occupancy,
    )


@router.get(
    "/",
    response_model=List[OccupancyResponse],
)
def get_all_occupancies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return OccupancyService.get_all_occupancies(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{occupancy_id}",
    response_model=OccupancyResponse,
)
def get_occupancy(
    occupancy_id: str,
    db: Session = Depends(get_db),
):
    occupancy = OccupancyService.get_occupancy(
        db=db,
        occupancy_id=occupancy_id,
    )

    if occupancy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Occupancy record not found",
        )

    return occupancy


@router.put(
    "/{occupancy_id}",
    response_model=OccupancyResponse,
)
def update_occupancy(
    occupancy_id: str,
    occupancy: OccupancyUpdate,
    db: Session = Depends(get_db),
):
    updated = OccupancyService.update_occupancy(
        db=db,
        occupancy_id=occupancy_id,
        occupancy=occupancy,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Occupancy record not found",
        )

    return updated


@router.delete(
    "/{occupancy_id}",
    response_model=OccupancyResponse,
)
def delete_occupancy(
    occupancy_id: str,
    db: Session = Depends(get_db),
):
    deleted = OccupancyService.delete_occupancy(
        db=db,
        occupancy_id=occupancy_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Occupancy record not found",
        )

    return deleted