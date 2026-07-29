from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.train import (
    TrainCreate,
    TrainResponse,
    TrainUpdate,
)
from app.services.train import TrainService

router = APIRouter()


@router.get(
    "/",
    response_model=List[TrainResponse],
)
def get_trains(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return TrainService.get_all_trains(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{train_id}",
    response_model=TrainResponse,
)
def get_train(
    train_id: str,
    db: Session = Depends(get_db),
):
    train = TrainService.get_train(
        db=db,
        train_id=train_id,
    )

    if train is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found",
        )

    return train


@router.post(
    "/",
    response_model=TrainResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_train(
    train: TrainCreate,
    db: Session = Depends(get_db),
):
    return TrainService.create_train(
        db=db,
        train=train,
    )


@router.put(
    "/{train_id}",
    response_model=TrainResponse,
)
def update_train(
    train_id: str,
    train_update: TrainUpdate,
    db: Session = Depends(get_db),
):
    train = TrainService.update_train(
        db=db,
        train_id=train_id,
        train_update=train_update,
    )

    if train is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found",
        )

    return train


@router.delete(
    "/{train_id}",
    response_model=TrainResponse,
)
def delete_train(
    train_id: str,
    db: Session = Depends(get_db),
):
    train = TrainService.delete_train(
        db=db,
        train_id=train_id,
    )

    if train is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Train not found",
        )

    return train