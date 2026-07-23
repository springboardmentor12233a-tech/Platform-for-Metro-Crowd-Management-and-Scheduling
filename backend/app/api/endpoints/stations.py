from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Station, CrowdMetric, User, AuditLog
from app.schemas import StationResponse, StationCreate
from app.api.deps import get_current_user, RoleChecker
import uuid

router = APIRouter()

@router.get("/", response_model=List[StationResponse])
def read_stations(db: Session = Depends(get_db)):
    stations = db.query(Station).all()
    return stations

@router.get("/{station_id}", response_model=StationResponse)
def read_station(station_id: uuid.UUID, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station

@router.post("/", response_model=StationResponse, dependencies=[Depends(RoleChecker(["admin"]))])
def create_station(station_in: StationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check duplicate name/code
    duplicate = db.query(Station).filter(
        (Station.name == station_in.name) | (Station.code == station_in.code)
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Station name or code already exists")
        
    station = Station(
        id=uuid.uuid4(),
        name=station_in.name,
        code=station_in.code,
        capacity=station_in.capacity,
        status=station_in.status,
        latitude=station_in.latitude,
        longitude=station_in.longitude
    )
    db.add(station)
    db.commit()
    db.refresh(station)
    
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="CREATE_STATION",
        details=f"Created station {station.name} ({station.code})."
    ))
    db.commit()
    
    return station

@router.put("/{station_id}", response_model=StationResponse)
def update_station(
    station_id: uuid.UUID, 
    station_in: StationCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Enforce access: Admin or Station Master of THIS station
    if current_user.role != "admin":
        if current_user.role != "station_master" or current_user.station_id != station_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this station."
            )
            
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
        
    station.name = station_in.name
    station.code = station_in.code
    station.capacity = station_in.capacity
    station.status = station_in.status
    station.latitude = station_in.latitude
    station.longitude = station_in.longitude
    
    db.commit()
    db.refresh(station)
    
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="UPDATE_STATION",
        details=f"Updated station {station.name} status to {station.status}."
    ))
    db.commit()
    
    return station
