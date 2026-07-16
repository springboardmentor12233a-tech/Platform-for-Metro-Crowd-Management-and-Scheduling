from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.services.prediction import predict_crowd
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/predictions", tags=["AI Prediction"])


@router.get("/crowd")
def get_crowd_prediction(
    station: str = Query(..., description="Station name, e.g. 'Rajiv Chowk'"),
    line: str = Query(..., description="Line name, e.g. 'Blue line'"),
    hour: int = Query(..., ge=0, le=23, description="Hour of day (0-23)"),
    day_of_week: Optional[str] = Query(None, description="e.g. 'Monday'. Defaults to today if omitted."),
    user=Depends(get_current_user),
):
    """
    Returns predicted passenger demand for a station at a given hour,
    using the trained crowd demand forecasting model.
    """
    result = predict_crowd(station_name=station, line=line, hour=hour, day_of_week=day_of_week)
    return result