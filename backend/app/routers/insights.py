from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import PredictionHistory, MetroAlert

router = APIRouter()


@router.get("/insights")
def get_operational_insights(db: Session = Depends(get_db)):

    # Total Predictions
    total_predictions = db.query(PredictionHistory).count()

    # Total Alerts
    total_alerts = db.query(MetroAlert).count()

    # High Priority Alerts
    high_priority_alerts = (
        db.query(MetroAlert)
        .filter(MetroAlert.priority == "HIGH")
        .count()
    )

    # Average Predicted Passengers
    average_predicted_passengers = (
        db.query(func.avg(PredictionHistory.predicted_passengers))
        .scalar()
    )

    # Total Extra Trains Recommended
    total_extra_trains = (
        db.query(func.sum(PredictionHistory.extra_trains))
        .scalar()
    )

    # Latest Prediction
    latest_prediction = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .first()
    )
    busiest_path = (
    db.query(
        PredictionHistory.from_station,
        PredictionHistory.to_station,
        func.sum(PredictionHistory.predicted_passengers).label("total_passengers")
    )
    .group_by(
        PredictionHistory.from_station,
        PredictionHistory.to_station
    )
    .order_by(
        func.sum(PredictionHistory.predicted_passengers).desc()
    )
    .first()
)

    return {

        "summary": {

            "total_predictions": total_predictions,

            "total_alerts": total_alerts,

            "high_priority_alerts": high_priority_alerts,

            "average_predicted_passengers": round(
                average_predicted_passengers, 2
            ) if average_predicted_passengers else 0,

            "total_extra_trains_recommended": total_extra_trains if total_extra_trains else 0,
            "busiest_path": (
             f"{busiest_path.from_station} → {busiest_path.to_station}"
                if busiest_path else "N/A"
            )

        },

        "current_status": {

            "crowd_level": latest_prediction.crowd_level if latest_prediction else None,

            "platform_status": latest_prediction.platform_status if latest_prediction else None,

            "recommended_train_interval": latest_prediction.recommended_train_interval if latest_prediction else None,

            "extra_trains": latest_prediction.extra_trains if latest_prediction else None

        }

    }