from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.train import TrainCreate, TrainUpdate, TrainResponse
from app.services import train_service

router = APIRouter(
    prefix="/trains",
    tags=["Trains"]
)


@router.post("/", response_model=TrainResponse)
def create_train(train: TrainCreate, db: Session = Depends(get_db)):
    return train_service.create_train(db, train)


@router.get("/", response_model=list[TrainResponse])
def get_all_trains(db: Session = Depends(get_db)):
    return train_service.get_all_trains(db)


@router.get("/{train_id}", response_model=TrainResponse)
def get_train(train_id: int, db: Session = Depends(get_db)):
    train = train_service.get_train_by_id(db, train_id)

    if not train:
        raise HTTPException(status_code=404, detail="Train not found")

    return train


@router.put("/{train_id}", response_model=TrainResponse)
def update_train(
    train_id: int,
    train: TrainUpdate,
    db: Session = Depends(get_db)
):
    updated_train = train_service.update_train(db, train_id, train)

    if not updated_train:
        raise HTTPException(status_code=404, detail="Train not found")

    return updated_train


@router.delete("/{train_id}")
def delete_train(
    train_id: int,
    db: Session = Depends(get_db)
):
    deleted_train = train_service.delete_train(db, train_id)

    if not deleted_train:
        raise HTTPException(status_code=404, detail="Train not found")

    return {"message": "Train deleted successfully"}