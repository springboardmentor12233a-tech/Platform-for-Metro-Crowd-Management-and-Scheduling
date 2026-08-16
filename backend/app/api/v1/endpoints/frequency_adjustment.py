from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.station import Station
from app.models.occupancy import Occupancy

# <-- Added the database model import -->
from app.models.frequency_adjustment import FrequencyAdjustment

from app.schemas.frequency_adjustment import (
    FrequencyAdjustmentRequest,
    FrequencyAdjustmentResponse,
)
from app.services.frequency_adjustment import (
    FrequencyAdjustmentService,
)

router = APIRouter()

@router.get("/stations")
def get_frequency_stations(
    db: Session = Depends(get_db),  
):
    stations = (
        db.query(
            Station.id,
            Station.station_name,
        )
        .join(
            Occupancy,
            Occupancy.station_id == Station.id,
        )
        .distinct()
        .order_by(
            Station.station_name
        )
        .all()
    )

    return [
        {
            "id": station.id,
            "station_name": station.station_name,
        }
        for station in stations
    ]
    

@router.post(
    "/recommend",
    response_model=FrequencyAdjustmentResponse,
)
def recommend_frequency(
    request: FrequencyAdjustmentRequest,
    db: Session = Depends(get_db),
):
    return FrequencyAdjustmentService.recommend(
        db=db,
        request=request,
    )


# ==========================================================
# NEW GET ROUTE: Fetch history for Analytics Dashboard
# ==========================================================
@router.get(
    "/",
    response_model=List[FrequencyAdjustmentResponse],
)
def get_all_frequency_adjustments(
    db: Session = Depends(get_db),
):
    return (
        db.query(FrequencyAdjustment)
        .order_by(FrequencyAdjustment.created_at.desc())
        .limit(100)
        .all()
    )