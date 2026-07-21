from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import SessionLocal
from app.models.prediction_history import PredictionHistory


def get_alerts():
    db: Session = SessionLocal()

    try:
        predictions = (
            db.query(PredictionHistory)
            .order_by(desc(PredictionHistory.created_at))
            .limit(20)
            .all()
        )

        alerts = []

        for prediction in predictions:

            passengers = int(prediction.predicted_passengers)

            if passengers >= 20:
                severity = "🔴 Critical"
                recommendation = (
                    "Increase train frequency and deploy additional staff."
                )

            elif passengers >= 10:
                severity = "🟡 Warning"
                recommendation = (
                    "Monitor passenger flow and prepare standby staff."
                )

            else:
                severity = "🟢 Normal"
                recommendation = (
                    "Normal operations. No action required."
                )

            alerts.append(
                {
                    "station": prediction.from_station,
                    "predicted_passengers": passengers,
                    "severity": severity,
                    "recommendation": recommendation,
                    "created_at": prediction.created_at,
                }
            )

        return alerts

    finally:
        db.close()