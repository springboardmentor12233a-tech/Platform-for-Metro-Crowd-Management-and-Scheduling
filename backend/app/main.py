from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Import all models so SQLAlchemy creates all tables
from app.models import *

# Import routers
from app.routers import (
    auth,
    station,
    passenger_flow,
    dashboard,
    prediction,
    forecast,
    history,
    schedule,
    prediction_history,
    alert,
    live_dashboard,
    crowd_monitoring,
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetroFlow API",
    version="1.0.0",
    description="""
# 🚆 MetroFlow API

AI-powered Metro Crowd Management and Scheduling Platform.

## Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 🚉 Station Management
- 👨‍👩‍👧 Passenger Flow Monitoring
- 🤖 AI Passenger Prediction
- 📈 Passenger Forecasting
- 🚆 Smart Scheduling
- 🚨 AI Alerts
- 📊 Dashboard & Analytics
- 📡 Live Crowd Monitoring
""",
    contact={
        "name": "MetroFlow Team",
        "email": "support@metroflow.com",
    },
)

# ------------------------------------------------
# CORS
# ------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# Routers
# ------------------------------------------------

app.include_router(auth.router)
app.include_router(station.router)
app.include_router(passenger_flow.router)
app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(forecast.router)
app.include_router(history.router)
app.include_router(schedule.router)
app.include_router(prediction_history.router)
app.include_router(alert.router)
app.include_router(live_dashboard.router)
app.include_router(crowd_monitoring.router)

# ------------------------------------------------
# Root
# ------------------------------------------------

@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to MetroFlow API 🚆",
        "status": "Running",
        "version": "1.0.0",
    }


# ------------------------------------------------
# Health
# ------------------------------------------------

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "backend": "FastAPI",
    }