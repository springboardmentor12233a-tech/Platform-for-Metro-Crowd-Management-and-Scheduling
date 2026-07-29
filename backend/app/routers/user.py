from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PredictionHistory, User
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/latest-prediction")
def get_latest_user_prediction(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    latest_prediction = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.user_id == current_user.id
        )
        .order_by(
            PredictionHistory.prediction_time.desc()
        )
        .first()
    )


    if not latest_prediction:
        return {
            "message": "No prediction history found"
        }


    return {

        "from_station": latest_prediction.from_station,

        "to_station": latest_prediction.to_station,

        "predicted_passengers":
            latest_prediction.predicted_passengers,

        "crowd_level":
            latest_prediction.crowd_level,

        "platform_status":
            latest_prediction.platform_status,

        "recommended_train_interval":
            latest_prediction.recommended_train_interval,

        "extra_trains":
            latest_prediction.extra_trains,

        "prediction_time":
            latest_prediction.prediction_time

    }

@router.get("/my-prediction")
def get_my_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    predictions = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .order_by(PredictionHistory.prediction_time.desc())
        .all()
    )

    return predictions