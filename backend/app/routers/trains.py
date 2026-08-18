from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database import get_db

from app.models.train import Train

from app.schemas.train import (
    TrainCreate,
    TrainResponse,
)


router = APIRouter(
    prefix="/trains",
    tags=["Trains"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
            )
        )
    ],
)


# ------------------------------------------------
# CREATE TRAIN
# ------------------------------------------------

@router.post(
    "/",
    response_model=TrainResponse,
)
def create_train(
    train_data: TrainCreate,
    db: Session = Depends(get_db),
):
    existing_train = (
        db.query(Train)
        .filter(
            Train.train_number
            == train_data.train_number
        )
        .first()
    )

    if existing_train:
        raise HTTPException(
            status_code=400,
            detail="Train number already exists.",
        )

    train = Train(
        train_number=train_data.train_number,
        train_name=train_data.train_name,
        line=train_data.line,
        train_type=train_data.train_type,
        capacity=train_data.capacity,
        coaches=train_data.coaches,
        status=train_data.status,
    )

    db.add(train)
    db.commit()
    db.refresh(train)

    return train


# ------------------------------------------------
# GET ALL TRAINS
# ------------------------------------------------

@router.get(
    "/",
    response_model=list[TrainResponse],
)
def get_trains(
    db: Session = Depends(get_db),
):
    trains = (
        db.query(Train)
        .order_by(Train.id.desc())
        .all()
    )

    return trains


# ------------------------------------------------
# GET SINGLE TRAIN
# ------------------------------------------------

@router.get(
    "/{train_id}",
    response_model=TrainResponse,
)
def get_train(
    train_id: int,
    db: Session = Depends(get_db),
):
    train = (
        db.query(Train)
        .filter(
            Train.id == train_id
        )
        .first()
    )

    if not train:
        raise HTTPException(
            status_code=404,
            detail="Train not found.",
        )

    return train