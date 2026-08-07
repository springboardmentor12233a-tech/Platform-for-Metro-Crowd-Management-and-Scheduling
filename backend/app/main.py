from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import activity_logs
# Import all models so SQLAlchemy creates all tables
from app.models import *

# Import routers
from app.routers import (
    auth,
    users,
    station,
    passenger_flow,
    dashboard,
    prediction,
    forecast,
    history,
    schedule,
    prediction_history,
    recommendation,
    ai,
    alert,
    reports,
    live_dashboard,
    crowd_monitoring,
    activity_analytics,
)

# ------------------------------------------------
# Create Database Tables
# ------------------------------------------------

Base.metadata.create_all(bind=engine)

# ------------------------------------------------
# FastAPI App
# ------------------------------------------------

app = FastAPI(
    title="MetroVision API",
    version="1.0.0",
    description="""
# 🚆 MetroVision API

AI-powered Metro Crowd Management and Scheduling Platform.

## Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 👤 User Management
- 🚉 Station Management
- 👨‍👩‍👧 Passenger Flow Monitoring
- 🤖 AI Passenger Prediction
- 📈 Passenger Forecasting
- 🚆 Smart Scheduling
- 🚨 AI Alerts
- 📊 Dashboard & Analytics
- 📡 Live Crowd Monitoring
- 📄 AI Report Generation
""",
    contact={
        "name": "MetroVision Team",
        "email": "support@metrovision.com",
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
# Register Routers
# ------------------------------------------------

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(station.router)
app.include_router(passenger_flow.router)
app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(forecast.router)
app.include_router(history.router)
app.include_router(schedule.router)
app.include_router(prediction_history.router)
app.include_router(recommendation.router)
app.include_router(ai.router)
app.include_router(alert.router)
app.include_router(reports.router)
app.include_router(live_dashboard.router)
app.include_router(activity_logs.router)
app.include_router(activity_analytics.router)
app.include_router(crowd_monitoring.router)

# ------------------------------------------------
# Root
# ------------------------------------------------

@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to MetroVision API 🚆",
        "status": "Running",
        "version": "1.0.0",
    }


# ------------------------------------------------
# Health Check
# ------------------------------------------------

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "backend": "FastAPI",
    }