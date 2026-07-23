from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Schedule, Station, User, AuditLog, CrowdMetric
from app.schemas import ScheduleResponse, ScheduleCreate, ScheduleRecommendation
from app.api.deps import get_current_user, RoleChecker
from datetime import datetime, timedelta
import uuid

router = APIRouter()

@router.get("/", response_model=List[ScheduleResponse])
def read_schedules(
    line_name: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Schedule)
    if line_name:
        query = query.filter(Schedule.line_name == line_name)
    if status:
        query = query.filter(Schedule.status == status)
        
    schedules = query.order_by(Schedule.scheduled_departure.asc()).all()
    
    # Map station names to response
    response_list = []
    for s in schedules:
        dep_station = db.query(Station).filter(Station.id == s.departure_station_id).first()
        arr_station = db.query(Station).filter(Station.id == s.arrival_station_id).first()
        
        response_list.append(
            ScheduleResponse(
                id=s.id,
                train_id=s.train_id,
                line_name=s.line_name,
                direction=s.direction,
                departure_station_id=s.departure_station_id,
                arrival_station_id=s.arrival_station_id,
                scheduled_departure=s.scheduled_departure,
                scheduled_arrival=s.scheduled_arrival,
                actual_departure=s.actual_departure,
                actual_arrival=s.actual_arrival,
                status=s.status,
                departure_station_name=dep_station.name if dep_station else "Unknown",
                arrival_station_name=arr_station.name if arr_station else "Unknown"
            )
        )
    return response_list

@router.post("/", response_model=ScheduleResponse, dependencies=[Depends(RoleChecker(["admin", "operator"]))])
def create_schedule(
    schedule_in: ScheduleCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify stations exist
    dep = db.query(Station).filter(Station.id == schedule_in.departure_station_id).first()
    arr = db.query(Station).filter(Station.id == schedule_in.arrival_station_id).first()
    if not dep or not arr:
        raise HTTPException(status_code=404, detail="Departure or Arrival station not found")
        
    schedule = Schedule(
        id=uuid.uuid4(),
        train_id=schedule_in.train_id,
        line_name=schedule_in.line_name,
        direction=schedule_in.direction,
        departure_station_id=schedule_in.departure_station_id,
        arrival_station_id=schedule_in.arrival_station_id,
        scheduled_departure=schedule_in.scheduled_departure,
        scheduled_arrival=schedule_in.scheduled_arrival,
        status=schedule_in.status
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="CREATE_SCHEDULE",
        details=f"Created schedule for train {schedule.train_id} on {schedule.line_name}."
    ))
    db.commit()
    
    return schedule

@router.put("/{schedule_id}", response_model=ScheduleResponse, dependencies=[Depends(RoleChecker(["admin", "operator"]))])
def update_schedule(
    schedule_id: uuid.UUID,
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
        
    # Verify stations exist
    dep = db.query(Station).filter(Station.id == schedule_in.departure_station_id).first()
    arr = db.query(Station).filter(Station.id == schedule_in.arrival_station_id).first()
    if not dep or not arr:
        raise HTTPException(status_code=404, detail="Departure or Arrival station not found")
        
    schedule.train_id = schedule_in.train_id
    schedule.line_name = schedule_in.line_name
    schedule.direction = schedule_in.direction
    schedule.departure_station_id = schedule_in.departure_station_id
    schedule.arrival_station_id = schedule_in.arrival_station_id
    schedule.scheduled_departure = schedule_in.scheduled_departure
    schedule.scheduled_arrival = schedule_in.scheduled_arrival
    schedule.actual_departure = schedule_in.actual_departure
    schedule.actual_arrival = schedule_in.actual_arrival
    schedule.status = schedule_in.status
    
    db.commit()
    db.refresh(schedule)
    
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="UPDATE_SCHEDULE",
        details=f"Updated schedule for train {schedule.train_id} (Status: {schedule.status})."
    ))
    db.commit()
    
    return schedule

@router.post("/optimize", response_model=List[ScheduleRecommendation], dependencies=[Depends(RoleChecker(["admin", "operator"]))])
def optimize_schedule(
    station_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
        
    # Query latest crowd metrics for patterns
    # In a real environment, we would call our ML model here. For this endpoint, we look at the historical
    # averages for this station by hour of day to create dynamic suggestions.
    metrics = db.query(CrowdMetric).filter(CrowdMetric.station_id == station_id).all()
    if not metrics:
        raise HTTPException(status_code=400, detail="No historical metrics available for optimization.")
        
    # Group by hour
    hourly_avg = {}
    for m in metrics:
        hr = m.recorded_at.hour
        if hr not in hourly_avg:
            hourly_avg[hr] = []
        hourly_avg[hr].append(m.passenger_count)
        
    recommendations = []
    
    # Standard operation hours: 5 AM to 11 PM
    for hr in range(5, 24):
        counts = hourly_avg.get(hr, [int(station.capacity * 0.2)])
        avg_crowd = int(sum(counts) / len(counts))
        utilization = avg_crowd / station.capacity
        
        # Scheduling Headway Optimization Heuristic
        suggested = 10  # Standard: 10 minutes
        action = False
        reason = "Normal operation flow. Standard headway sufficient."
        
        if utilization > 0.80:
            suggested = 4  # Extreme Peak: 4 minutes
            action = True
            reason = "Extreme passenger congestion predicted. Reduce headway to 4 mins."
        elif utilization > 0.60:
            suggested = 6  # Moderate Peak: 6 minutes
            action = True
            reason = "High passenger volume predicted. Reduce headway to 6 mins."
            
        recommendations.append(
            ScheduleRecommendation(
                hour=hr,
                forecasted_crowd=avg_crowd,
                utilization=round(utilization, 2),
                suggested_headway_minutes=suggested,
                action_required=action,
                reason=reason
            )
        )
        
    # Audit log
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=current_user.id,
        action="OPTIMIZE_SCHEDULE",
        details=f"Ran dynamic schedule optimization recommendation for station {station.name}."
    ))
    db.commit()
    
    return recommendations
