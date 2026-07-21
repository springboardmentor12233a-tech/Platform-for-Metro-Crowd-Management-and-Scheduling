from sqlalchemy.orm import Session

from app.models.prediction_history import PredictionHistory


def save_prediction(db: Session, prediction_data: dict):

    history = PredictionHistory(
        from_station=prediction_data["from_station"],
        to_station=prediction_data["to_station"],
        distance_km=prediction_data["distance_km"],
        fare=prediction_data["fare"],
        cost_per_passenger=prediction_data["cost_per_passenger"],
        ticket_type=prediction_data["ticket_type"],
        remarks=prediction_data["remarks"],
        predicted_passengers=prediction_data["predicted_passengers"],
        crowd_level=prediction_data["crowd_level"],
        recommendation=prediction_data["recommendation"],
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_prediction_history(db: Session):
    return (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.created_at.desc())
        .all()
    )