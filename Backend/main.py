import pandas as pd
import joblib
import numpy as np

from alerts import check_and_create_overcrowding_alert, check_and_create_delay_alert, sio
from alerts import check_and_create_overcrowding_alert
from alerts import router as alerts_router
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models
from jose import jwt 
from datetime import datetime, timedelta
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "metroflow-secret-key-change-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

crowd_model = joblib.load("crowd_model.pkl")
weather_encoder = joblib.load("weather_encoder.pkl")
crowd_encoder = joblib.load("crowd_encoder.pkl")

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(alerts_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "MetroFlow API running"}

@app.post("/stations")
def add_station(name: str, capacity: int = 1000):
    db = SessionLocal()
    station = models.Station(name=name, capacity=capacity)
    db.add(station)
    db.commit()
    db.refresh(station)
    db.close()
    return station


@app.get("/stations")
def list_stations():
    db = SessionLocal()
    stations = db.query(models.Station).all()
    db.close()
    return stations

@app.put("/stations/{station_id}")
def update_station(station_id: int, name: str = None, capacity: int = None):
    db = SessionLocal()
    station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if not station:
        db.close()
        return {"error": "Station not found"}
    if name:
        station.name = name
    if capacity:
        station.capacity = capacity
    db.commit()
    db.refresh(station)
    db.close()
    return station

@app.delete("/stations/{station_id}")
def delete_station(station_id: int, role: str):
    if role != "admin":
        return {"error": "Only admin can delete stations"}
    db = SessionLocal()
    station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if not station:
        db.close()
        return {"error": "Station not found"}
    db.delete(station)
    db.commit()
    db.close()
    return {"message": f"Station {station_id} deleted"}

@app.post("/users/register")
def register_user(username: str, email: str, password: str, role: str = "operator"):
    db = SessionLocal()
    hashed = pwd_context.hash(password)
    user = models.User(username=username, email=email, hashed_password=hashed, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return {"id": user.id, "username": user.username, "email": user.email, "role": user.role}

@app.post("/users/login")
async def login_user(email: str, password: str):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == email).first()
    db.close()
    if not user or not pwd_context.verify(password, user.hashed_password):
        return {"error": "Invalid email or password"}
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"message": "Login successful", "username": user.username, "role": user.role, "access_token": access_token, "token_type": "bearer"}

@app.post("/predict-crowd")
async def predict_crowd(passenger_count: int, occupancy_percent: float, is_holiday: int, peak_hour: int, weather: str, station: str, db: Session = Depends(get_db)):
    try:
        weather_encoded = weather_encoder.transform([weather])[0]
    except ValueError:
        return {"error": f"Unknown weather value. Expected one of: {list(weather_encoder.classes_)}"}

    input_data = np.array([[passenger_count, occupancy_percent, is_holiday, peak_hour, weather_encoded]])
    prediction_encoded = crowd_model.predict(input_data)[0]
    prediction_label = crowd_encoder.inverse_transform([prediction_encoded])[0]
    await check_and_create_overcrowding_alert(db=db, station=station, crowd_level=prediction_label)
    return {
        "predicted_crowd_level": prediction_label,
        "input": {
            "passenger_count": passenger_count,
            "occupancy_percent": occupancy_percent,
            "is_holiday": is_holiday,
            "peak_hour": peak_hour,
            "weather": weather
        }
    }

@app.post("/report-delay")
async def report_delay(station: str, delay_minutes: int, db: Session = Depends(get_db)):
    alert = await check_and_create_delay_alert(db=db, station=station, delay_minutes=delay_minutes)
    if alert:
        return {"message": "Delay alert created", "alert": alert}
    return {"message": "Delay within acceptable range, no alert created"}

@app.post("/emergency-alert")
async def raise_emergency(station: str, message: str, db: Session = Depends(get_db)):
    new_alert = models.Alert(
        alert_type="Emergency",
        station=station,
        message=message,
        severity="High",
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    await sio.emit("new_alert", {
        "id": new_alert.id,
        "alert_type": new_alert.alert_type,
        "station": new_alert.station,
        "message": new_alert.message,
        "severity": new_alert.severity,
    })

    return {"message": "Emergency alert raised", "alert": new_alert}

@app.get("/frequency-recommendation")
def frequency_recommendation(crowd_level: str):
    crowd_level = crowd_level.capitalize()

    recommendations = {
        "Low": {"frequency_minutes": 15, "action": "Normal Operation"},
        "Medium": {"frequency_minutes": 8, "action": "Deploy Crowd Control"},
        "High": {"frequency_minutes": 4, "action": "Increase Train Frequency"}
    }

    if crowd_level not in recommendations:
        return {"error": f"Invalid crowd_level. Expected one of: Low, Medium, High"}

    result = recommendations[crowd_level]

    return {
        "crowd_level": crowd_level,
        "recommended_frequency_minutes": result["frequency_minutes"],
        "recommended_action": result["action"]
    }

@app.post("/schedules")
def add_schedule(station_name: str, departure_time: str, frequency_minutes: int = 10, status: str = "On Time"):
    db = SessionLocal()
    schedule = models.Schedule(
        station_name=station_name,
        departure_time=departure_time,
        frequency_minutes=frequency_minutes,
        status=status
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    db.close()
    return schedule


@app.get("/schedules")
def get_schedules():
    db = SessionLocal()
    schedules = db.query(models.Schedule).all()
    db.close()
    return schedules


@app.put("/schedules/{schedule_id}")
def update_schedule(schedule_id: int, station_name: str = None, departure_time: str = None, frequency_minutes: int = None, status: str = None):
    db = SessionLocal()
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if not schedule:
        db.close()
        return {"error": "Schedule not found"}
    if station_name:
        schedule.station_name = station_name
    if departure_time:
        schedule.departure_time = departure_time
    if frequency_minutes:
        schedule.frequency_minutes = frequency_minutes
    if status:
        schedule.status = status
    db.commit()
    db.refresh(schedule)
    db.close()
    return schedule


@app.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: int):
    db = SessionLocal()
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if not schedule:
        db.close()
        return {"error": "Schedule not found"}
    db.delete(schedule)
    db.commit()
    db.close()
    return {"message": f"Schedule {schedule_id} deleted"}

@app.get("/traffic-report")
def traffic_report():
    df = pd.read_excel("MetroFlow_Dataset.xlsx")

    station_summary = (
        df.groupby("Station")
        .agg(
            avg_passenger_count=("Passenger_Count", "mean"),
            avg_occupancy_percent=("Occupancy_Percent", "mean"),
            total_delay_minutes=("Delay_Minutes", "sum"),
            peak_hour_records=("Peak_Hour", "sum")
        )
        .round(2)
        .reset_index()
        .to_dict(orient="records")
    )

    crowd_level_distribution = (
        df["Crowd_Level"].value_counts().to_dict()
    )

    busiest_station = df.groupby("Station")["Passenger_Count"].sum().idxmax()

    return {
        "station_summary": station_summary,
        "crowd_level_distribution": crowd_level_distribution,
        "busiest_station": busiest_station,
        "total_records_analyzed": len(df)
    }

@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    df = pd.read_excel("MetroFlow_Dataset.xlsx")

    station_summary = (
        df.groupby("Station")
        .agg(
            avg_passenger_count=("Passenger_Count", "mean"),
            avg_occupancy_percent=("Occupancy_Percent", "mean"),
            total_delay_minutes=("Delay_Minutes", "sum"),
        )
        .round(2)
        .reset_index()
        .to_dict(orient="records")
    )

    crowd_level_distribution = df["Crowd_Level"].value_counts().to_dict()
    busiest_station = df.groupby("Station")["Passenger_Count"].sum().idxmax()

    total_alerts = db.query(models.Alert).count()
    active_alerts = db.query(models.Alert).filter(models.Alert.is_resolved == False).count()
    alerts_by_type = {}
    for alert_type in ["Overcrowding", "Delay", "Emergency"]:
        alerts_by_type[alert_type] = db.query(models.Alert).filter(models.Alert.alert_type == alert_type).count()

    recent_alerts = db.query(models.Alert).order_by(models.Alert.created_at.desc()).limit(5).all()

    return {
        "station_summary": station_summary,
        "crowd_level_distribution": crowd_level_distribution,
        "busiest_station": busiest_station,
        "alerts": {
            "total": total_alerts,
            "active": active_alerts,
            "by_type": alerts_by_type,
            "recent": recent_alerts,
        },
    }

@app.get("/congestion-heatmap")
def congestion_heatmap():
    df = pd.read_excel("MetroFlow_Dataset.xlsx")
    df["Hour"] = df["Time"].apply(lambda t: int(str(t).split(":")[0]))

    heatmap_data = (
        df.groupby(["Station", "Hour"])
        .agg(avg_occupancy_percent=("Occupancy_Percent", "mean"))
        .round(2)
        .reset_index()
        .to_dict(orient="records")
    )

    return {"heatmap": heatmap_data}

@app.get("/ai-insights")
def ai_insights():
    df = pd.read_excel("MetroFlow_Dataset.xlsx")
    df["Hour"] = df["Time"].apply(lambda t: int(str(t).split(":")[0]))

    insights = []

    busiest_station = df.groupby("Station")["Passenger_Count"].sum().idxmax()
    insights.append(f"{busiest_station} is the busiest station based on total passenger volume.")

    peak_hour = df.groupby("Hour")["Passenger_Count"].mean().idxmax()
    insights.append(f"Passenger demand peaks around {peak_hour}:00 hours across the network.")

    most_delayed_station = df.groupby("Station")["Delay_Minutes"].sum().idxmax()
    insights.append(f"{most_delayed_station} station has the highest cumulative delays; consider frequency adjustment.")

    high_occupancy_station = df.groupby("Station")["Occupancy_Percent"].mean().idxmax()
    avg_occ = df.groupby("Station")["Occupancy_Percent"].mean().max()
    insights.append(f"{high_occupancy_station} station runs at {avg_occ:.1f}% average occupancy, the highest in the network.")

    return {"insights": insights}

import socketio
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)