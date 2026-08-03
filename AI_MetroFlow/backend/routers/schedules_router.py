import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from backend.models.schemas import ScheduleCreate, ScheduleUpdate, OptimizeFrequencyRequest
from backend.auth import require_roles
from backend.database import db_memory, is_mongo_connected, mongo_client, settings

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
async def get_schedules(
    train_id: Optional[str] = None,
    status: Optional[str] = None
):
    schedules = []
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        query = {}
        if train_id:
            query["train_id"] = train_id
        if status:
            query["status"] = status
        cursor = db.schedules.find(query)
        schedules = await cursor.to_list(length=100)
    else:
        schedules = list(db_memory.schedules.values())
        if train_id:
            schedules = [s for s in schedules if s["train_id"] == train_id]
        if status:
            schedules = [s for s in schedules if s["status"].lower() == status.lower()]
            
    return schedules

@router.get("/{schedule_id}")
async def get_schedule(schedule_id: str):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        sc = await db.schedules.find_one({"id": schedule_id})
        if sc:
            return sc
    if schedule_id in db_memory.schedules:
        return db_memory.schedules[schedule_id]
        
    raise HTTPException(status_code=404, detail="Schedule entry not found")

@router.post("", response_model=dict)
@router.post("/", response_model=dict)
async def create_schedule(sch_data: ScheduleCreate, current_user: dict = Depends(require_roles(["Admin"]))):
    sch_doc = sch_data.dict()
    sch_doc["id"] = f"SCH-{uuid.uuid4().hex[:6]}"
    sch_doc["delay_minutes"] = 0
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.schedules.insert_one(sch_doc)
        
    db_memory.schedules[sch_doc["id"]] = sch_doc
    return sch_doc

@router.put("/{schedule_id}")
async def update_schedule(
    schedule_id: str,
    sch_data: ScheduleUpdate,
    current_user: dict = Depends(require_roles(["Admin", "Operator"]))
):
    update_dict = {k: v for k, v in sch_data.dict().items() if v is not None}
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.schedules.update_one({"id": schedule_id}, {"$set": update_dict})
        sc = await db.schedules.find_one({"id": schedule_id})
        if sc:
            return sc
            
    if schedule_id in db_memory.schedules:
        db_memory.schedules[schedule_id].update(update_dict)
        return db_memory.schedules[schedule_id]
        
    raise HTTPException(status_code=404, detail="Schedule not found")

@router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: str, current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.schedules.delete_one({"id": schedule_id})
        
    if schedule_id in db_memory.schedules:
        del db_memory.schedules[schedule_id]
        
    return {"message": "Schedule deleted successfully."}

@router.post("/optimize-frequency")
async def optimize_frequency(req: OptimizeFrequencyRequest, current_user: dict = Depends(require_roles(["Admin", "Operator"]))):
    # Algorithm to compute recommended train headway (dispatch frequency in mins)
    base_headway = 6.0
    if req.time_window == "Peak Morning":
        base_headway = 3.5
    elif req.time_window == "Peak Evening":
        base_headway = 4.0
    else:
        base_headway = 8.5
        
    recommended_headway = round(base_headway * (req.target_max_occupancy / 80.0), 1)
    additional_trains_needed = max(0, int((8.0 - recommended_headway) * 2))
    
    return {
        "route_name": req.route_name,
        "time_window": req.time_window,
        "recommended_headway_minutes": recommended_headway,
        "recommended_train_count": 18 + additional_trains_needed,
        "estimated_wait_time_sec": int(recommended_headway * 30),
        "crowd_reduction_percent": round(15.5 + (additional_trains_needed * 3.2), 1),
        "confidence_score": 0.94
    }
