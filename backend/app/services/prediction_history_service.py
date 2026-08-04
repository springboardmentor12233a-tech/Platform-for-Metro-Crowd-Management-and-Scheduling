from sqlalchemy.orm import Session

from app.repositories.prediction_history_repository import (
    save_prediction_history,
    get_prediction_history,
    get_prediction_by_id,
    delete_prediction
)


def create_prediction_history(
    db: Session,
    request_data: dict,
    prediction_result: dict
):
    """
    Save prediction history to PostgreSQL.
    """

    alert = prediction_result.get("alert", {})

    prediction_data = {
        **request_data,

        "predicted_passengers": prediction_result.get("predicted_passengers"),
        "crowd_level": prediction_result.get("crowd_level"),
        "recommendations": ", ".join(
            prediction_result.get("recommendations", [])
        ),

        "alert_status": alert.get("status"),
        "alert_severity": alert.get("severity"),
        "alert_type": alert.get("type"),
        "alert_message": alert.get("message"),
    }

    return save_prediction_history(db, prediction_data)


def fetch_prediction_history(
    db: Session,
    page: int,
    limit: int,
    station: str | None = None,
    crowd_level: str | None = None,
    alert_severity: str | None = None,
    sort: str = "latest"
):
    return get_prediction_history(
        db=db,
        page=page,
        limit=limit,
        station=station,
        crowd_level=crowd_level,
        alert_severity=alert_severity,
        sort=sort
    )


def fetch_prediction_by_id(
    db: Session,
    prediction_id: int
):
    return get_prediction_by_id(db, prediction_id)


def remove_prediction(
    db: Session,
    prediction_id: int
):
    return delete_prediction(db, prediction_id)