from math import ceil
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.postgres import get_db

from app.schemas.prediction_history import (
    PredictionHistoryResponse,
    PredictionHistoryListResponse
)

from app.services.prediction_history_service import (
    fetch_prediction_history,
    fetch_prediction_by_id,
    remove_prediction
)

router = APIRouter(
    prefix="/prediction-history",
    tags=["Prediction History"]
)


@router.get(
    "/",
    response_model=PredictionHistoryListResponse
)
def get_prediction_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    station: Optional[str] = None,
    crowd_level: Optional[str] = None,
    alert_severity: Optional[str] = None,
    sort: str = Query("latest", pattern="^(latest|oldest)$"),
    db: Session = Depends(get_db)
):
    total_records, data = fetch_prediction_history(
        db=db,
        page=page,
        limit=limit,
        station=station,
        crowd_level=crowd_level,
        alert_severity=alert_severity,
        sort=sort
    )

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": ceil(total_records / limit) if total_records else 0,
        "data": data
    }


@router.get(
    "/{prediction_id}",
    response_model=PredictionHistoryResponse
)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    prediction = fetch_prediction_by_id(db, prediction_id)

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found."
        )

    return prediction


@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    prediction = remove_prediction(db, prediction_id)

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found."
        )

    return {
        "message": "Prediction deleted successfully."
    }