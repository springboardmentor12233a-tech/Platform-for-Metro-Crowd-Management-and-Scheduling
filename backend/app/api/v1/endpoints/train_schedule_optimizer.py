from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

# <-- Added the database model import -->
from app.models.schedule_prediction import SchedulePrediction

from app.schemas.train_schedule_optimizer import (
    TrainScheduleOptimizationRequest,
    TrainScheduleOptimizationResponse,
)

from app.services.train_schedule_optimizer import (
    TrainScheduleOptimizerService,
)


router = APIRouter()


@router.post(
    "/optimize",
    response_model=TrainScheduleOptimizationResponse,
)
def optimize_train_schedule(
    request: TrainScheduleOptimizationRequest,
    db: Session = Depends(get_db),
):
    return TrainScheduleOptimizerService.optimize(
        db=db,
        request=request,
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[TrainScheduleOptimizationResponse],
)
def get_all_schedule_predictions(
    db: Session = Depends(get_db),
):
    predictions = (
        db.query(SchedulePrediction)
        .order_by(SchedulePrediction.prediction_time.desc())
        .limit(100)
        .all()
    )
    
    formatted_responses = []
    
    for p in predictions:
        # Safely extract the station name from the database relationship
        station_name = p.station.station_name if p.station else "Unknown Station"
        
        formatted_responses.append(
            TrainScheduleOptimizationResponse(
                station_name=station_name,
                train_id=p.train_id,
                schedule_action=p.schedule_action,
                action_code=p.action_code,
                current_departure_time=p.current_departure_time,
                recommended_departure_time=p.recommended_departure_time,
                current_platform=p.current_platform,
                recommended_platform=p.recommended_platform,
                predicted_passengers=p.predicted_passengers,
                crowd_level=p.crowd_level,
                current_frequency=p.current_frequency,
                recommended_frequency=p.recommended_frequency,
                delay_minutes=p.delay_minutes,
                train_to_allocate=p.train_to_allocate,
                reschedule_required=p.reschedule_required,
                recommendation=p.recommendation,
                reason=p.reason,
            )
        )

    return formatted_responses