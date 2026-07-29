from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database import get_db
from app.models import PredictionHistory, MetroAlert

router = APIRouter()


@router.get("/reports")
def generate_report(db: Session = Depends(get_db)):

    total_predictions = db.query(PredictionHistory).count()

    avg_passengers = (
        db.query(func.avg(PredictionHistory.predicted_passengers))
        .scalar()
    )

    highest_passengers = (
        db.query(func.max(PredictionHistory.predicted_passengers))
        .scalar()
    )

    lowest_passengers = (
        db.query(func.min(PredictionHistory.predicted_passengers))
        .scalar()
    )

    total_alerts = db.query(MetroAlert).count()

    high_priority = (
        db.query(MetroAlert)
        .filter(MetroAlert.priority == "HIGH")
        .count()
    )

    medium_priority = (
        db.query(MetroAlert)
        .filter(MetroAlert.priority == "MEDIUM")
        .count()
    )

    low_priority = (
        db.query(MetroAlert)
        .filter(MetroAlert.priority == "LOW")
        .count()
    )

    latest_prediction = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .first()
    )

    return {

        "report_generated_at": datetime.utcnow(),

        "prediction_summary": {

            "total_predictions": total_predictions,

            "average_predicted_passengers": round(avg_passengers, 2)
            if avg_passengers else 0,

            "highest_predicted_passengers": highest_passengers,

            "lowest_predicted_passengers": lowest_passengers
        },

        "alert_summary": {

            "total_alerts": total_alerts,

            "high_priority_alerts": high_priority,

            "medium_priority_alerts": medium_priority,

            "low_priority_alerts": low_priority
        },

        "current_status": {

            "crowd_level":
                latest_prediction.crowd_level if latest_prediction else None,

            "platform_status":
                latest_prediction.platform_status if latest_prediction else None,

            "recommended_train_interval":
                latest_prediction.recommended_train_interval if latest_prediction else None,

            "extra_trains":
                latest_prediction.extra_trains if latest_prediction else None
        }

    }