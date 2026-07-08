from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import all models so SQLAlchemy creates the tables
from app.models import *

# Import routers
from app.routers import auth, station, passenger_flow, dashboard

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetroFlow API",
    version="1.0.0",
    description="AI Metro Crowd Management and Scheduling Platform",
)

# CORS Configuration

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers

app.include_router(auth.router)
app.include_router(station.router)
app.include_router(passenger_flow.router)
app.include_router(dashboard.router)

# Root Endpoint

@app.get("/")
def root():
    return {
        "message": "Welcome to MetroFlow API 🚆",
        "status": "Running"
    }

# Health Check

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "backend": "FastAPI"
    }