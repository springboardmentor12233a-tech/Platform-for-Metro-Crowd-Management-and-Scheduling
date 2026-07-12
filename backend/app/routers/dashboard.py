from fastapi import APIRouter

router = APIRouter()

# Dashboard Summary
@router.get("/dashboard")
def dashboard():
    return {
        "stations": 285,
        "trains": 8990,
        "schedules": 417080,
        "crowd_status": "Moderate"
    }

# Stations API
@router.get("/stations")
def get_stations():
    return {
        "total_stations": 285,
        "status": "Data Loaded Successfully"
    }

# Trains API
@router.get("/trains")
def get_trains():
    return {
        "total_trains": 8990,
        "status": "Data Loaded Successfully"
    }

# Schedules API
@router.get("/schedules")
def get_schedules():
    return {
        "total_schedules": 417080,
        "status": "Data Loaded Successfully"
    }