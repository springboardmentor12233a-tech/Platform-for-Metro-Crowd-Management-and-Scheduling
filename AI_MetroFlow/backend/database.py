import os
import csv
import uuid
import logging
from typing import Dict, List, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings
from backend.auth import get_password_hash

logger = logging.getLogger("metroflow.database")

# In-Memory Database Fallback Store
class InMemoryDB:
    def __init__(self):
        self.users: Dict[str, dict] = {}
        self.stations: Dict[str, dict] = {}
        self.trains: Dict[str, dict] = {}
        self.schedules: Dict[str, dict] = {}
        self.predictions: Dict[str, dict] = {}
        self.reports: Dict[str, dict] = {}

db_memory = InMemoryDB()
mongo_client: Optional[AsyncIOMotorClient] = None
is_mongo_connected = False

async def init_db():
    global mongo_client, is_mongo_connected
    try:
        mongo_client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
        # Verify ping
        await mongo_client.admin.command('ping')
        is_mongo_connected = True
        logger.info(f"[+] Connected to MongoDB at {settings.MONGO_URI}")
    except Exception as e:
        is_mongo_connected = False
        logger.warning(f"[-] Local MongoDB unavailable ({e}). Using robust In-Memory Database engine.")

    # Seed Initial Data
    await seed_initial_data()

async def seed_initial_data():
    logger.info("[+] Seeding default database accounts and metro network dataset...")
    
    # 1. Default Users
    default_users = [
        {
            "id": "usr-admin-01",
            "name": "System Administrator",
            "email": "admin@metroflow.com",
            "password": get_password_hash("admin123"),
            "role": "Admin",
            "is_active": True,
            "theme": "dark",
            "created_at": "2026-01-01T00:00:00"
        },
        {
            "id": "usr-operator-01",
            "name": "Metro Operator",
            "email": "operator@metroflow.com",
            "password": get_password_hash("operator123"),
            "role": "Operator",
            "is_active": True,
            "theme": "dark",
            "created_at": "2026-01-01T00:00:00"
        },
        {
            "id": "usr-analyst-01",
            "name": "Crowd Analyst",
            "email": "analyst@metroflow.com",
            "password": get_password_hash("analyst123"),
            "role": "Analyst",
            "is_active": True,
            "theme": "dark",
            "created_at": "2026-01-01T00:00:00"
        }
    ]
    
    for u in default_users:
        if is_mongo_connected and mongo_client:
            db = mongo_client[settings.DATABASE_NAME]
            existing = await db.users.find_one({"email": u["email"]})
            if not existing:
                await db.users.insert_one(u)
        db_memory.users[u["id"]] = u

    # 2. Seed Stations from CSV
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "datasets", "Delhi-Metro-Network.csv")
    
    if os.path.exists(csv_path):
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                st_id = row.get("Station ID", f"ST-{uuid.uuid4().hex[:4]}")
                st_doc = {
                    "id": st_id,
                    "station_id": st_id,
                    "name": row.get("Station Name", "Station"),
                    "line": row.get("Line", "Yellow Line"),
                    "latitude": float(row.get("Latitude", 28.6)),
                    "longitude": float(row.get("Longitude", 77.2)),
                    "platform_count": int(row.get("Platform Count", 2)),
                    "capacity_threshold": 1500,
                    "current_footfall": int(row.get("Daily Passengers", 100000)) // 150, # Instantaneous baseline
                    "status": "Green"
                }
                if is_mongo_connected and mongo_client:
                    db = mongo_client[settings.DATABASE_NAME]
                    ex = await db.stations.find_one({"station_id": st_id})
                    if not ex:
                        await db.stations.insert_one(st_doc)
                db_memory.stations[st_id] = st_doc
    
    # 3. Seed Trains
    default_trains = [
        {"id": "TR-101", "train_id": "TR-101", "name": "Delhi Express 01", "line": "Yellow Line", "capacity": 1400, "status": "In Service", "occupancy_rate": 78.4, "current_station_id": "ST-001", "next_station_id": "ST-004"},
        {"id": "TR-102", "train_id": "TR-102", "name": "Metro Shuttle 02", "line": "Yellow Line", "capacity": 1200, "status": "In Service", "occupancy_rate": 62.1, "current_station_id": "ST-004", "next_station_id": "ST-006"},
        {"id": "TR-103", "train_id": "TR-103", "name": "Capital Runner 03", "line": "Red Line", "capacity": 1500, "status": "In Service", "occupancy_rate": 84.0, "current_station_id": "ST-002", "next_station_id": "ST-003"},
        {"id": "TR-104", "train_id": "TR-104", "name": "East-West Bullet 04", "line": "Blue Line", "capacity": 1600, "status": "Delayed", "occupancy_rate": 91.5, "current_station_id": "ST-009", "next_station_id": "ST-010"},
        {"id": "TR-105", "train_id": "TR-105", "name": "South Looper 05", "line": "Magenta Line", "capacity": 1200, "status": "In Service", "occupancy_rate": 45.0, "current_station_id": "ST-017", "next_station_id": "ST-019"}
    ]
    for tr in default_trains:
        if is_mongo_connected and mongo_client:
            db = mongo_client[settings.DATABASE_NAME]
            ex = await db.trains.find_one({"train_id": tr["train_id"]})
            if not ex:
                await db.trains.insert_one(tr)
        db_memory.trains[tr["train_id"]] = tr

    # 4. Seed Schedules
    default_schedules = [
        {"id": "SCH-1001", "train_id": "TR-101", "route_name": "Yellow Line Northbound", "origin_station_id": "ST-001", "destination_station_id": "ST-002", "departure_time": "08:15", "arrival_time": "08:35", "platform": 1, "status": "On Time", "delay_minutes": 0},
        {"id": "SCH-1002", "train_id": "TR-102", "route_name": "Yellow Line Southbound", "origin_station_id": "ST-004", "destination_station_id": "ST-005", "departure_time": "08:30", "arrival_time": "08:52", "platform": 2, "status": "On Time", "delay_minutes": 0},
        {"id": "SCH-1003", "train_id": "TR-104", "route_name": "Blue Line Eastbound", "origin_station_id": "ST-009", "destination_station_id": "ST-011", "departure_time": "08:20", "arrival_time": "08:50", "platform": 1, "status": "Delayed", "delay_minutes": 12}
    ]
    for sc in default_schedules:
        if is_mongo_connected and mongo_client:
            db = mongo_client[settings.DATABASE_NAME]
            ex = await db.schedules.find_one({"id": sc["id"]})
            if not ex:
                await db.schedules.insert_one(sc)
        db_memory.schedules[sc["id"]] = sc

    logger.info("[SUCCESS] Initial seed complete.")
