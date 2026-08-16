from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.crowd_prediction import CrowdPrediction  # <-- Make sure this is imported!
from app.schemas.crowd_prediction import (
    CrowdPredictionRequest,
    CrowdPredictionResponse,
)
from app.services.crowd_prediction import (
    CrowdPredictionService,
)

router = APIRouter()


@router.post(
    "/predict",
    response_model=CrowdPredictionResponse,
)
def predict_crowd(
    request: CrowdPredictionRequest,
    db: Session = Depends(get_db),
):
    return CrowdPredictionService.predict_crowd(
        db=db,
        request=request,
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[CrowdPredictionResponse],
)
def get_all_crowd_predictions(
    db: Session = Depends(get_db),
):
    predictions = (
        db.query(CrowdPrediction)
        .order_by(CrowdPrediction.prediction_time.desc())
        .limit(100)
        .all()
    )
    
    formatted_responses = []
    
    for p in predictions:
        # Safely extract the station name from the database relationship
        station_name = p.station.station_name if p.station else "Unknown Station"
        
        formatted_responses.append(
            CrowdPredictionResponse(
                id=p.id,
                station_id=p.station_id,
                station_name=station_name, # Map the extracted name here!
                prediction_time=p.prediction_time,
                predicted_entries=p.predicted_entries,
                predicted_exits=p.predicted_exits,
                predicted_platform_crowd=p.predicted_platform_crowd,
                predicted_crowd_level=p.predicted_crowd_level,
                confidence_score=p.confidence_score,
            )
        )

    return formatted_responses