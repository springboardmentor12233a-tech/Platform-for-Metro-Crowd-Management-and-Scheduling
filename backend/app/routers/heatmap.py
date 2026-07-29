from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PredictionHistory

router = APIRouter()


@router.get("/heatmap")
def get_heatmap_data(db: Session = Depends(get_db)):

    predictions = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "from_station": prediction.from_station,
            "to_station": prediction.to_station,
            "predicted_passengers": prediction.predicted_passengers,
            "crowd_level": prediction.crowd_level,
            "platform_status": prediction.platform_status,
            "prediction_time": prediction.prediction_time
        }
        for prediction in predictions
    ]