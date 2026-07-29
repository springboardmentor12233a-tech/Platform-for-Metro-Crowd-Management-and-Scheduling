from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import MetroAlert

router = APIRouter()


@router.get("/alerts")
def get_alerts(
    priority: Optional[str] = Query(
        default=None,
        description="Filter alerts by priority (HIGH, MEDIUM, LOW)"
    ),
    limit: Optional[int] = Query(
        default=None,
        ge=1,
        description="Number of latest alerts to return"
    ),
    db: Session = Depends(get_db)
):
    query = (
        db.query(MetroAlert)
        .options(joinedload(MetroAlert.prediction))
    )

    # Filter by priority
    if priority:
        query = query.filter(
            MetroAlert.priority == priority.upper()
        )

    # Latest alerts first
    query = query.order_by(MetroAlert.created_at.desc())

    # Limit results
    if limit:
        query = query.limit(limit)

    alerts = query.all()

    response = []

    for alert in alerts:
        response.append({
            "id": alert.id,
            "priority": alert.priority,
            "title": alert.title,
            "message": alert.message,
            "recommendation": alert.recommendation,
            "passenger_advisory": alert.passenger_advisory,
            "notification_type": alert.notification_type,
            "status": alert.status,
            "created_at": alert.created_at,

            "from_station": alert.prediction.from_station,
            "to_station": alert.prediction.to_station,
            "crowd_level": alert.prediction.crowd_level,
            "predicted_passengers": alert.prediction.predicted_passengers,
            "weather": alert.prediction.weather
        })

    return response