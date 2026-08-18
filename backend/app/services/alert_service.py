from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import SessionLocal

from app.models.alert import Alert
from app.models.prediction_history import PredictionHistory


# =========================================================
# NORMALIZE DATETIME
# =========================================================

def normalize_datetime(value):

    if value is None:
        return datetime.min

    if isinstance(value, datetime):

        if value.tzinfo is not None:
            return value.replace(tzinfo=None)

        return value

    return datetime.min


# =========================================================
# GET AI + MANUAL ALERTS
# =========================================================

def get_alerts():

    db: Session = SessionLocal()

    try:

        alerts = []

        # =================================================
        # AI GENERATED ALERTS
        # =================================================

        predictions = (
            db.query(PredictionHistory)
            .order_by(
                desc(
                    PredictionHistory.created_at
                )
            )
            .limit(20)
            .all()
        )

        for prediction in predictions:

            passengers = int(
                prediction.predicted_passengers
            )

            if passengers >= 20:

                severity = "🔴 Critical"

                recommendation = (
                    "Increase train frequency and "
                    "deploy additional staff."
                )

            elif passengers >= 10:

                severity = "🟡 Warning"

                recommendation = (
                    "Monitor passenger flow and "
                    "prepare standby staff."
                )

            else:

                severity = "🟢 Normal"

                recommendation = (
                    "Normal operations. "
                    "No action required."
                )

            alerts.append(
                {
                    "station": prediction.from_station,

                    "predicted_passengers": passengers,

                    "severity": severity,

                    "recommendation": recommendation,

                    "created_at": prediction.created_at,

                    # Important
                    "source": "AI Generated",

                    "alert_type": "AI Crowd Prediction",
                }
            )


        # =================================================
        # MANUAL EMERGENCY ALERTS
        # =================================================

        emergency_alerts = (
            db.query(Alert)
            .order_by(
                desc(
                    Alert.created_at
                )
            )
            .limit(20)
            .all()
        )

        for alert in emergency_alerts:

            alert_type = getattr(
                alert,
                "alert_type",
                "Emergency Alert",
            )

            alerts.append(
                {
                    "station": alert.station,

                    "predicted_passengers": 0,

                    "severity": alert.severity,

                    "recommendation": alert.message,

                    "created_at": alert.created_at,

                    # Important
                    "source": "Manual Emergency",

                    "alert_type": alert_type,
                }
            )


        # =================================================
        # SORT ALL ALERTS
        # =================================================

        alerts.sort(
            key=lambda alert: normalize_datetime(
                alert.get("created_at")
            ),
            reverse=True,
        )


        # =================================================
        # RETURN LATEST 40
        # =================================================

        return alerts[:40]

    finally:

        db.close()


# =========================================================
# CREATE MANUAL EMERGENCY ALERT
# =========================================================

def create_emergency_alert(
    station: str,
    message: str,
    severity: str,
    alert_type: str,
):

    db: Session = SessionLocal()

    try:

        alert = Alert(
            station=station,
            message=message,
            severity=severity,
            alert_type=alert_type,
            created_at=datetime.utcnow(),
        )

        db.add(alert)

        db.commit()

        db.refresh(alert)

        return alert

    finally:

        db.close()