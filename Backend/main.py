import joblib
import numpy as np

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
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
def login_user(email: str, password: str):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == email).first()
    db.close()
    if not user or not pwd_context.verify(password, user.hashed_password):
        return {"error": "Invalid email or password"}
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"message": "Login successful", "username": user.username, "role": user.role, "access_token": access_token, "token_type": "bearer"}

@app.post("/predict-crowd")
def predict_crowd(passenger_count: int, occupancy_percent: float, is_holiday: int, peak_hour: int, weather: str):
    try:
        weather_encoded = weather_encoder.transform([weather])[0]
    except ValueError:
        return {"error": f"Unknown weather value. Expected one of: {list(weather_encoder.classes_)}"}

    input_data = np.array([[passenger_count, occupancy_percent, is_holiday, peak_hour, weather_encoded]])
    prediction_encoded = crowd_model.predict(input_data)[0]
    prediction_label = crowd_encoder.inverse_transform([prediction_encoded])[0]

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