import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from backend.models.schemas import StationCreate, StationUpdate, StationResponse
from backend.auth import require_roles
from backend.database import db_memory, is_mongo_connected, mongo_client, settings

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("", response_model=List[StationResponse])
@router.get("/", response_model=List[StationResponse])
async def get_stations(
    search: Optional[str] = None,
    line: Optional[str] = None,
    status: Optional[str] = None
):
    stations = []
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        query = {}
        if line:
            query["line"] = line
        if status:
            query["status"] = status
        cursor = db.stations.find(query)
        stations = await cursor.to_list(length=200)
    else:
        stations = list(db_memory.stations.values())
        if line:
            stations = [s for s in stations if s["line"].lower() == line.lower()]
        if status:
            stations = [s for s in stations if s["status"].lower() == status.lower()]
            
    if search:
        search_lower = search.lower()
        stations = [s for s in stations if search_lower in s["name"].lower() or search_lower in s["station_id"].lower()]
        
    return stations

@router.get("/{station_id}", response_model=StationResponse)
async def get_station(station_id: str):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        st = await db.stations.find_one({"station_id": station_id})
        if st:
            return st
    if station_id in db_memory.stations:
        return db_memory.stations[station_id]
        
    raise HTTPException(status_code=404, detail="Station not found")

@router.post("", response_model=StationResponse)
@router.post("/", response_model=StationResponse)
async def create_station(station_data: StationCreate, current_user: dict = Depends(require_roles(["Admin"]))):
    st_doc = station_data.dict()
    st_doc["id"] = st_doc["station_id"]
    st_doc["current_footfall"] = 250
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.stations.insert_one(st_doc)
        
    db_memory.stations[st_doc["station_id"]] = st_doc
    return st_doc

@router.put("/{station_id}", response_model=StationResponse)
async def update_station(
    station_id: str,
    station_data: StationUpdate,
    current_user: dict = Depends(require_roles(["Admin", "Operator"]))
):
    update_dict = {k: v for k, v in station_data.dict().items() if v is not None}
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.stations.update_one({"station_id": station_id}, {"$set": update_dict})
        st = await db.stations.find_one({"station_id": station_id})
        if st:
            return st
            
    if station_id in db_memory.stations:
        db_memory.stations[station_id].update(update_dict)
        return db_memory.stations[station_id]
        
    raise HTTPException(status_code=404, detail="Station not found")

@router.delete("/{station_id}")
async def delete_station(station_id: str, current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.stations.delete_one({"station_id": station_id})
        
    if station_id in db_memory.stations:
        del db_memory.stations[station_id]
        
    return {"message": "Station deleted successfully."}
