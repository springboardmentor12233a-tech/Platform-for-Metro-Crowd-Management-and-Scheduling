"""
Train Status Endpoints
=======================
Provides real-time train position and status data.
Milestone 1: Returns dummy data.
"""
from fastapi import APIRouter, Query
from app.utils.response import success_response

router = APIRouter()

DUMMY_TRAINS = [
    {
        "train_id": "TRN001", "train_number": "MT-101", "line": "Blue Line",
        "current_station": "Central Station", "next_station": "East Junction",
        "status": "ON_TIME", "delay_minutes": 0,
        "speed_kmh": 75.0, "occupancy_percent": 68.2, "direction": "Northbound",
    },
    {
        "train_id": "TRN002", "train_number": "MT-202", "line": "Red Line",
        "current_station": "West Gate", "next_station": "Airport Link",
        "status": "DELAYED", "delay_minutes": 12,
        "speed_kmh": 55.0, "occupancy_percent": 82.1, "direction": "Eastbound",
    },
    {
        "train_id": "TRN003", "train_number": "MT-303", "line": "Green Line",
        "current_station": "North Terminal", "next_station": "Central Station",
        "status": "ON_TIME", "delay_minutes": 0,
        "speed_kmh": 80.0, "occupancy_percent": 41.5, "direction": "Southbound",
    },
    {
        "train_id": "TRN004", "train_number": "MT-404", "line": "Blue Line",
        "current_station": "North Terminal", "next_station": "N/A",
        "status": "CANCELLED", "delay_minutes": 0,
        "speed_kmh": 0.0, "occupancy_percent": 0.0, "direction": "Southbound",
    },
    {
        "train_id": "TRN005", "train_number": "MT-505", "line": "Yellow Line",
        "current_station": "South Bridge", "next_station": "West Gate",
        "status": "ON_TIME", "delay_minutes": 0,
        "speed_kmh": 72.0, "occupancy_percent": 55.8, "direction": "Westbound",
    },
]


@router.get("/", summary="Get All Train Statuses")
async def get_trains(
    line: str = Query(None, description="Filter by metro line"),
    status: str = Query(None, description="Filter by status: ON_TIME | DELAYED | CANCELLED"),
):
    """Returns real-time status of all trains, optionally filtered."""
    trains = DUMMY_TRAINS
    if line:
        trains = [t for t in trains if t["line"].lower() == line.lower()]
    if status:
        trains = [t for t in trains if t["status"] == status.upper()]
    return success_response({
        "total": len(trains),
        "on_time_count": sum(1 for t in trains if t["status"] == "ON_TIME"),
        "delayed_count": sum(1 for t in trains if t["status"] == "DELAYED"),
        "trains": trains,
    })


@router.get("/{train_id}", summary="Get Train by ID")
async def get_train(train_id: str):
    """Returns status of a specific train."""
    train = next((t for t in DUMMY_TRAINS if t["train_id"] == train_id), None)
    if not train:
        return {"status": "error", "message": f"Train {train_id} not found"}
    return success_response(train)
