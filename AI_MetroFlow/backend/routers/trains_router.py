import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from backend.models.schemas import TrainCreate, TrainUpdate, TrainResponse
from backend.auth import require_roles
from backend.database import db_memory, is_mongo_connected, mongo_client, settings

router = APIRouter(prefix="/trains", tags=["Trains"])

@router.get("", response_model=List[TrainResponse])
@router.get("/", response_model=List[TrainResponse])
async def get_trains(status: Optional[str] = None, line: Optional[str] = None):
    trains = []
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        query = {}
        if status:
            query["status"] = status
        if line:
            query["line"] = line
        cursor = db.trains.find(query)
        trains = await cursor.to_list(length=100)
    else:
        trains = list(db_memory.trains.values())
        if status:
            trains = [t for t in trains if t["status"].lower() == status.lower()]
        if line:
            trains = [t for t in trains if t["line"].lower() == line.lower()]
            
    return trains

@router.get("/{train_id}", response_model=TrainResponse)
async def get_train(train_id: str):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        tr = await db.trains.find_one({"train_id": train_id})
        if tr:
            return tr
    if train_id in db_memory.trains:
        return db_memory.trains[train_id]
        
    raise HTTPException(status_code=404, detail="Train not found")

@router.post("", response_model=TrainResponse)
@router.post("/", response_model=TrainResponse)
async def create_train(train_data: TrainCreate, current_user: dict = Depends(require_roles(["Admin"]))):
    tr_doc = train_data.dict()
    tr_doc["id"] = tr_doc["train_id"]
    tr_doc["occupancy_rate"] = 50.0
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.trains.insert_one(tr_doc)
        
    db_memory.trains[tr_doc["train_id"]] = tr_doc
    return tr_doc

@router.put("/{train_id}", response_model=TrainResponse)
async def update_train(
    train_id: str,
    train_data: TrainUpdate,
    current_user: dict = Depends(require_roles(["Admin", "Operator"]))
):
    update_dict = {k: v for k, v in train_data.dict().items() if v is not None}
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.trains.update_one({"train_id": train_id}, {"$set": update_dict})
        tr = await db.trains.find_one({"train_id": train_id})
        if tr:
            return tr
            
    if train_id in db_memory.trains:
        db_memory.trains[train_id].update(update_dict)
        return db_memory.trains[train_id]
        
    raise HTTPException(status_code=404, detail="Train not found")

@router.delete("/{train_id}")
async def delete_train(train_id: str, current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.trains.delete_one({"train_id": train_id})
        
    if train_id in db_memory.trains:
        del db_memory.trains[train_id]
        
    return {"message": "Train deleted successfully."}
