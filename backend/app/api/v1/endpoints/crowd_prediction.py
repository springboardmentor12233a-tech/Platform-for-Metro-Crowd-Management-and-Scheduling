from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.crowd_prediction import (
    CrowdPredictionCreate,
    CrowdPredictionUpdate,
    CrowdPredictionResponse,
    CrowdPredictionRequest,
)
from app.services.crowd_prediction import CrowdPredictionService

router = APIRouter()


# -------------------------------------------------------
# ML Crowd Prediction
# -------------------------------------------------------
@router.post(
    "/predict",
    status_code=status.HTTP_200_OK,
)
def predict_crowd(
    request: CrowdPredictionRequest,
):
    return CrowdPredictionService.predict_crowd(request)


# -------------------------------------------------------
# Create Prediction
# -------------------------------------------------------
@router.post(
    "/",
    response_model=CrowdPredictionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prediction(
    prediction: CrowdPredictionCreate,
    db: Session = Depends(get_db),
):
    return CrowdPredictionService.create_prediction(
        db=db,
        prediction=prediction,
    )


# -------------------------------------------------------
# Get All Predictions
# -------------------------------------------------------
@router.get(
    "/",
    response_model=List[CrowdPredictionResponse],
)
def get_all_predictions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return CrowdPredictionService.get_all_predictions(
        db=db,
        skip=skip,
        limit=limit,
    )


# -------------------------------------------------------
# Get Prediction by ID
# -------------------------------------------------------
@router.get(
    "/{prediction_id}",
    response_model=CrowdPredictionResponse,
)
def get_prediction(
    prediction_id: str,
    db: Session = Depends(get_db),
):
    prediction = CrowdPredictionService.get_prediction(
        db=db,
        prediction_id=prediction_id,
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crowd prediction not found",
        )

    return prediction


# -------------------------------------------------------
# Update Prediction
# -------------------------------------------------------
@router.put(
    "/{prediction_id}",
    response_model=CrowdPredictionResponse,
)
def update_prediction(
    prediction_id: str,
    prediction: CrowdPredictionUpdate,
    db: Session = Depends(get_db),
):
    updated_prediction = CrowdPredictionService.update_prediction(
        db=db,
        prediction_id=prediction_id,
        prediction=prediction,
    )

    if updated_prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crowd prediction not found",
        )

    return updated_prediction


# -------------------------------------------------------
# Delete Prediction
# -------------------------------------------------------
@router.delete(
    "/{prediction_id}",
    response_model=CrowdPredictionResponse,
)
def delete_prediction(
    prediction_id: str,
    db: Session = Depends(get_db),
):
    deleted_prediction = CrowdPredictionService.delete_prediction(
        db=db,
        prediction_id=prediction_id,
    )

    if deleted_prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crowd prediction not found",
        )

    return deleted_prediction