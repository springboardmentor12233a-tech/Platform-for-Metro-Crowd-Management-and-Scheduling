from fastapi import FastAPI
from sqlalchemy import text

from app.database.mongodb import mongodb
from app.database.postgres import engine
from app.database.base import Base

# ==========================
# Models
# ==========================
from app.models.station import Station
from app.models.route import Route
from app.models.train import Train
from app.models.train_schedule import TrainSchedule
from app.models.passenger_data import PassengerData

# ==========================
# Routers
# ==========================
from app.api.auth import router as auth_router
from app.api.station import router as station_router
from app.api.route import router as route_router
from app.api.train import router as train_router
from app.api.train_schedule import router as train_schedule_router
from app.api.passenger_data import router as passenger_data_router
from app.api.prediction import router as prediction_router

# ==========================
# FastAPI App
# ==========================
app = FastAPI(
    title="AI MetroFlow API",
    version="1.0.0",
    description="AI Platform for Metro Crowd Management and Scheduling"
)

# ==========================
# Create PostgreSQL Tables
# ==========================
Base.metadata.create_all(bind=engine)

# ==========================
# Register Routers
# ==========================
app.include_router(auth_router)
app.include_router(station_router)
app.include_router(route_router)
app.include_router(train_router)
app.include_router(train_schedule_router)
app.include_router(passenger_data_router)
app.include_router(prediction_router)

# ==========================
# Home
# ==========================
@app.get("/")
def home():
    return {
        "message": "AI MetroFlow API Running",
        "version": "1.0.0",
        "status": "Connected"
    }

# ==========================
# PostgreSQL Test
# ==========================
@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "PostgreSQL Connected"}
    except Exception as e:
        return {
            "status": "Connection Failed",
            "error": str(e)
        }