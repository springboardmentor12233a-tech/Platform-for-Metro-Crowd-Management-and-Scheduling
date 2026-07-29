from fastapi import APIRouter,Depends,Request
import pandas as pd
from app.schemas import PredictionRequest
from app.ml_model import model, preprocessor
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import PredictionHistory
from app.services.llm_services import generate_alert
from app.models import MetroAlert
from app.utils.auth import get_current_user

router = APIRouter()


@router.post("/predict")
def predict(request: PredictionRequest,req:Request,db: Session = Depends(get_db),current_user = Depends(get_current_user)):

    print(req.headers)
    input_data = pd.DataFrame([{
        "From_Station": request.from_station,
        "To_Station": request.to_station,
        "Distance_km": request.distance_km,
        "Fare": request.fare,
        "Cost_per_passenger": request.cost_per_passenger,
        "Ticket_Type": request.ticket_type,
        "Remarks": request.remarks,
        "Month": request.month,
        "Weekday": request.weekday,
        "Hour": request.hour,
        "Weather": request.weather,
        "Is_Holiday": request.is_holiday,
        "Is_Peak_Hour": request.is_peak_hour
         
    }])

    print("========== RAW INPUT ==========")
    print(input_data)

    input_encoded = preprocessor.transform(input_data)

    print("========== ENCODED INPUT ==========")
    print(input_encoded)

    prediction = model.predict(input_encoded)

    print("========== PREDICTION ==========")
    print(prediction)

    predicted_passengers = round(prediction[0])

    if predicted_passengers < 80:

        crowd_level = "LOW"
        priority = "LOW"
        platform_status = "Normal"
        train_interval = "10 minutes"
        extra_trains = 0

        recommendation = (
            "Current train schedule is sufficient."
        )

    elif predicted_passengers < 150:

        crowd_level = "MODERATE"
        priority = "MEDIUM"
        platform_status = "Busy"
        train_interval = "7 minutes"
        extra_trains = 1

        recommendation = (
            "Deploy additional station staff and monitor passenger flow."
        )

    else:

        crowd_level = "HIGH"
        priority = "HIGH"
        platform_status = "Congested"
        train_interval = "3 minutes"
        extra_trains = 2

        recommendation = (
            "Increase train frequency immediately."
        )
    history = PredictionHistory(
    user_id=current_user.id,
    from_station=request.from_station,
    to_station=request.to_station,

    distance_km=request.distance_km,
    fare=request.fare,
    cost_per_passenger=request.cost_per_passenger,

    ticket_type=request.ticket_type,
    remarks=request.remarks,

    month=request.month,
    weekday=request.weekday,
    hour=request.hour,

    weather=request.weather,
    is_holiday=request.is_holiday,
    is_peak_hour=request.is_peak_hour,

    predicted_passengers=predicted_passengers,
    crowd_level=crowd_level,
    platform_status=platform_status,
    recommended_train_interval=train_interval,
    extra_trains=extra_trains,
    recommendation=recommendation
)

    db.add(history)
    db.commit()
    db.refresh(history)

    prediction_data = {
    
    "from_station": history.from_station,
    "to_station": history.to_station,
    "weather": history.weather,
    "predicted_passengers": history.predicted_passengers,
    "crowd_level": history.crowd_level,
    "priority": priority,
    "platform_status": history.platform_status,
    "recommended_train_interval": history.recommended_train_interval,
    "extra_trains": history.extra_trains
}

    print("Calling Gemini...")

    alert = generate_alert(prediction_data)
    alert["priority"] = priority

    print("Gemini call completed!")

    print("========== GEMINI RESPONSE ==========")
    print(alert)

    try:
            metro_alert = MetroAlert(
                prediction_id=history.id,
                priority=alert["priority"],
                title="Metro AI Alert",
                message=alert["alert"],
                recommendation=alert["recommendation"],
                passenger_advisory=alert["passenger_advisory"],
                notification_type=alert["notification_type"],
                announcement=alert["announcement"]
            )

            db.add(metro_alert)
            db.commit()
            db.refresh(metro_alert)

            print("✅ MetroAlert saved!")
            print("Alert ID:", metro_alert.id)

    except Exception as e:
        db.rollback()
        print("❌ Error:", repr(e))
    return {
    "predicted_passengers": predicted_passengers,
    "from_station": request.from_station,
    "to_station": request.to_station,

    "crowd_level": crowd_level,

    "platform_status": platform_status,
    "recommended_train_interval": train_interval,
    "extra_trains": extra_trains,

    "recommendation": recommendation,

    "alert": {
    "priority": metro_alert.priority,
    "alert": metro_alert.message,
    "recommendation": metro_alert.recommendation,
    "passenger_advisory": metro_alert.passenger_advisory,
    "notification_type": metro_alert.notification_type,
    "announcement": metro_alert.announcement  
}
}