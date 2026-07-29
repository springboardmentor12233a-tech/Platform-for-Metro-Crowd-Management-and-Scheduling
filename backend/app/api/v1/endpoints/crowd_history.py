from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.crowd_history import (
    CrowdHistoryCreate,
    CrowdHistoryUpdate,
    CrowdHistoryResponse,
)
from app.services.crowd_history import CrowdHistoryService

router = APIRouter()


@router.post(
    "/",
    response_model=CrowdHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_crowd_history(
    crowd_history: CrowdHistoryCreate,
    db: Session = Depends(get_db),
):
    return CrowdHistoryService.create_crowd_history(
        db=db,
        crowd_history=crowd_history,
    )


@router.get(
    "/",
    response_model=List[CrowdHistoryResponse],
)
def get_all_crowd_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return CrowdHistoryService.get_all_crowd_history(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{history_id}",
    response_model=CrowdHistoryResponse,
)
def get_crowd_history(
    history_id: str,
    db: Session = Depends(get_db),
):
    history = CrowdHistoryService.get_crowd_history(
        db=db,
        history_id=history_id,
    )

    if history is None:
        raise HTTPException(
            status_code=404,
            detail="Crowd history record not found",
        )

    return history


@router.put(
    "/{history_id}",
    response_model=CrowdHistoryResponse,
)
def update_crowd_history(
    history_id: str,
    crowd_history: CrowdHistoryUpdate,
    db: Session = Depends(get_db),
):
    updated = CrowdHistoryService.update_crowd_history(
        db=db,
        history_id=history_id,
        crowd_history=crowd_history,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Crowd history record not found",
        )

    return updated


@router.delete(
    "/{history_id}",
    response_model=CrowdHistoryResponse,
)
def delete_crowd_history(
    history_id: str,
    db: Session = Depends(get_db),
):
    deleted = CrowdHistoryService.delete_crowd_history(
        db=db,
        history_id=history_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Crowd history record not found",
        )

    return deleted