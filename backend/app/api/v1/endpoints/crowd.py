"""
Crowd Monitoring Endpoints
===========================
Returns real-time crowd density data per station.
Milestone 1: Returns dummy data.
"""
from fastapi import APIRouter, Query
from datetime import datetime, timezone
from app.utils.response import success_response

router = APIRouter()

DUMMY_CROWD_DATA = [
    {"station_id": "ST001", "station_name": "Central Station", "platform": "Platform 1", "density_level": "HIGH", "headcount": 1450, "capacity": 2000, "occupancy_percent": 72.5},
    {"station_id": "ST002", "station_name": "North Terminal", "platform": "Platform 2", "density_level": "MEDIUM", "headcount": 680, "capacity": 1500, "occupancy_percent": 45.3},
    {"station_id": "ST003", "station_name": "East Junction", "platform": "Platform 1", "density_level": "CRITICAL", "headcount": 2100, "capacity": 2200, "occupancy_percent": 95.4},
    {"station_id": "ST004", "station_name": "West Gate", "platform": "Platform 3", "density_level": "LOW", "headcount": 210, "capacity": 1800, "occupancy_percent": 11.7},
    {"station_id": "ST005", "station_name": "South Bridge", "platform": "Platform 2", "density_level": "HIGH", "headcount": 1320, "capacity": 1600, "occupancy_percent": 82.5},
    {"station_id": "ST006", "station_name": "Airport Link", "platform": "Platform 1", "density_level": "MEDIUM", "headcount": 890, "capacity": 2000, "occupancy_percent": 44.5},
]


@router.get("/", summary="Get All Station Crowd Levels")
async def get_crowd_levels():
    """Returns current crowd levels for all monitored stations."""
    now = datetime.now(timezone.utc).isoformat()
    readings = [{**r, "timestamp": now} for r in DUMMY_CROWD_DATA]
    return success_response({
        "total_stations": len(readings),
        "critical_count": sum(1 for r in readings if r["density_level"] == "CRITICAL"),
        "high_count": sum(1 for r in readings if r["density_level"] == "HIGH"),
        "average_occupancy": round(sum(r["occupancy_percent"] for r in readings) / len(readings), 1),
        "readings": readings,
    })


@router.get("/{station_id}", summary="Get Crowd Level by Station")
async def get_station_crowd(station_id: str):
    """Returns crowd level for a specific station."""
    station = next((s for s in DUMMY_CROWD_DATA if s["station_id"] == station_id), None)
    if not station:
        return {"status": "error", "message": f"Station {station_id} not found"}
    return success_response({**station, "timestamp": datetime.now(timezone.utc).isoformat()})
