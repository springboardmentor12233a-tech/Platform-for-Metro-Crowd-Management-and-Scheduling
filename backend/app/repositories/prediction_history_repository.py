from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.prediction_history import PredictionHistory


def save_prediction_history(db: Session, prediction_data: dict):
    history = PredictionHistory(**prediction_data)

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_prediction_history(
    db: Session,
    page: int,
    limit: int,
    station: str | None = None,
    crowd_level: str | None = None,
    alert_severity: str | None = None,
    sort: str = "latest"
):
    print("\n========== DEBUG ==========")
    print("Database URL:", db.bind.url)

    all_rows = db.query(PredictionHistory).all()
    print("Total rows:", len(all_rows))

    for row in all_rows:
        print(row.prediction_id, row.from_station)

    print("===========================\n")

    query = db.query(PredictionHistory)

    if station:
        query = query.filter(
            or_(
                PredictionHistory.from_station.ilike(f"%{station}%"),
                PredictionHistory.to_station.ilike(f"%{station}%")
            )
        )

    if crowd_level:
        query = query.filter(
            PredictionHistory.crowd_level.ilike(f"%{crowd_level}%")
        )

    if alert_severity:
        query = query.filter(
            PredictionHistory.alert_severity.ilike(f"%{alert_severity}%")
        )

    total_records = query.count()

    if sort == "oldest":
        query = query.order_by(
            PredictionHistory.prediction_time.asc()
        )
    else:
        query = query.order_by(
            PredictionHistory.prediction_time.desc()
        )

    data = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return total_records, data


def get_prediction_by_id(db: Session, prediction_id: int):
    return (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.prediction_id == prediction_id
        )
        .first()
    )


def delete_prediction(db: Session, prediction_id: int):
    prediction = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.prediction_id == prediction_id
        )
        .first()
    )

    if prediction is None:
        return None

    db.delete(prediction)
    db.commit()

    return prediction