from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import PredictionHistory
from app.models import PredictionHistory, MetroAlert

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
@router.get("/latest")
def get_latest_prediction(db: Session = Depends(get_db)):

    latest = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .first()
    )

    if not latest:
        return {"message": "No prediction history found"}

    return {
        "from_station": latest.from_station,
        "to_station": latest.to_station,
        "predicted_passengers": latest.predicted_passengers,
        "crowd_level": latest.crowd_level,
        "platform_status": latest.platform_status,
        "recommended_train_interval": latest.recommended_train_interval,
        "extra_trains": latest.extra_trains,
        "recommendation": latest.recommendation,
        "prediction_time": latest.prediction_time
    }
@router.get("/history")
def get_prediction_history(db: Session = Depends(get_db)):

    history = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .limit(20)
        .all()
    )

    return [
        {
            "id": item.id,
            "from_station": item.from_station,
            "to_station": item.to_station,
            "predicted_passengers": item.predicted_passengers,
            "crowd_level": item.crowd_level,
            "platform_status": item.platform_status,
            "recommended_train_interval": item.recommended_train_interval,
            "extra_trains": item.extra_trains,
            "recommendation": item.recommendation,
            "prediction_time": item.prediction_time
        }
        for item in history
    ]
@router.get("/dashboard/frontend")
def get_dashboard(db: Session = Depends(get_db)):

    # Latest Prediction
    latest_prediction = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .first()
    )

    # Latest Alert
    latest_record = (
        db.query(PredictionHistory, MetroAlert)
    .join(
        MetroAlert,
        MetroAlert.prediction_id == PredictionHistory.id
    )
    .order_by(MetroAlert.created_at.desc())
    .first()
)
    if latest_record:
        prediction, alert = latest_record
    else:
        prediction = None
        alert = None
    # Recent Predictions
    recent_predictions = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.prediction_time.desc())
        .limit(5)
        .all()
    )
    print("Latest Record:", latest_record)
    print("Prediction:", prediction)
    print("Alert:", alert)    
    return {

        "latest_prediction": {
            "from_station": latest_prediction.from_station if latest_prediction else None,
            "to_station": latest_prediction.to_station if latest_prediction else None,
            "predicted_passengers": latest_prediction.predicted_passengers if latest_prediction else None,
            "crowd_level": latest_prediction.crowd_level if latest_prediction else None,
            "platform_status": latest_prediction.platform_status if latest_prediction else None,
            "recommended_train_interval": latest_prediction.recommended_train_interval if latest_prediction else None,
            "extra_trains": latest_prediction.extra_trains if latest_prediction else None,
            "prediction_time": latest_prediction.prediction_time if latest_prediction else None
        },

        "latest_alert": {
            "priority": alert.priority if alert else None,
            "title": alert.title if alert else None,
            "message": alert.message if alert else None,
            "notification_type": alert.notification_type if alert else None,
            "passenger_advisory": alert.passenger_advisory if alert else None,

            "from_station": prediction.from_station if prediction else None,
            "to_station": prediction.to_station if prediction else None,
            "predicted_passengers": prediction.predicted_passengers if prediction else None,
            "crowd_level": prediction.crowd_level if prediction else None,
},

       "latest_announcement": {
         "announcement": alert.announcement if alert else None
},
    "latest_ai_recommendation": {
        "recommendation": alert.recommendation if alert else None
},

        "recent_predictions": [
            {
                "from_station": prediction.from_station,
                "to_station": prediction.to_station,
                "predicted_passengers": prediction.predicted_passengers,
                "crowd_level": prediction.crowd_level,
                "prediction_time": prediction.prediction_time
            }
            for prediction in recent_predictions
        ]
    }