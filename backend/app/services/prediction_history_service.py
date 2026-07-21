from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import SessionLocal
from app.models.prediction_history import PredictionHistory


def get_prediction_history():
    db: Session = SessionLocal()

    try:
        history = (
            db.query(PredictionHistory)
            .order_by(desc(PredictionHistory.created_at))
            .all()
        )

        result = []

        for item in history:
            result.append({
                "id": item.id,
                "from_station": item.from_station,
                "to_station": item.to_station,
                "predicted_passengers": item.predicted_passengers,
                "ticket_type": item.ticket_type,
                "remarks": item.remarks,
                "created_at": item.created_at,
            })

        return result

    finally:
        db.close()