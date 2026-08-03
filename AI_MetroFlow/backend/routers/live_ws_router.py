import asyncio
import json
import random
import logging
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.database import db_memory, is_mongo_connected, mongo_client, settings

router = APIRouter(prefix="", tags=["Real-time Telemetry"])
logger = logging.getLogger("metroflow.ws")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"[+] WebSocket Client Connected. Active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"[-] WebSocket Client Disconnected. Active: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

def generate_live_telemetry_snapshot():
    # Dynamic perturbation of station footfalls and moving trains
    stations_list = list(db_memory.stations.values())
    trains_list = list(db_memory.trains.values())
    
    updated_stations = []
    for s in stations_list:
        delta = random.randint(-15, 20)
        curr = max(100, s.get("current_footfall", 450) + delta)
        s["current_footfall"] = curr
        
        if curr > 1400:
            s["status"] = "Red"
        elif curr > 1000:
            s["status"] = "Orange"
        elif curr > 750:
            s["status"] = "Yellow"
        else:
            s["status"] = "Green"
        updated_stations.append({
            "station_id": s.get("station_id"),
            "name": s.get("name"),
            "line": s.get("line"),
            "latitude": s.get("latitude"),
            "longitude": s.get("longitude"),
            "current_footfall": curr,
            "status": s.get("status")
        })
        
    alerts = []
    red_stations = [s["name"] for s in updated_stations if s["status"] == "Red"]
    if red_stations:
        alerts.append({
            "id": f"ALT-{random.randint(100,999)}",
            "level": "CRITICAL",
            "title": f"High Crowd Surge at {red_stations[0]}",
            "message": f"Footfall threshold exceeded at {red_stations[0]}. Automated dispatch frequency recommendation triggered.",
            "timestamp": "Just now"
        })
        
    return {
        "type": "TELEMETRY_UPDATE",
        "timestamp": "2026-08-03T18:05:00",
        "stations": updated_stations,
        "trains": trains_list,
        "alerts": alerts,
        "system_metrics": {
            "network_efficiency": round(random.uniform(92.0, 98.5), 1),
            "active_passengers_total": sum(s["current_footfall"] for s in updated_stations),
            "delayed_trains_count": sum(1 for t in trains_list if t.get("status") == "Delayed")
        }
    }

@router.websocket("/api/crowd/ws")
async def websocket_crowd_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            snapshot = generate_live_telemetry_snapshot()
            await websocket.send_json(snapshot)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"[-] WS Exception: {e}")
        manager.disconnect(websocket)

@router.get("/api/live-status")
async def get_live_status_snapshot():
    return generate_live_telemetry_snapshot()
