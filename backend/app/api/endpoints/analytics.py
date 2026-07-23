from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Station, CrowdMetric, Schedule, Alert, AuditLog
from app.api.deps import get_current_user
from datetime import datetime, timedelta
import pandas as pd
import io
import uuid

router = APIRouter()

@router.get("/summary")
def get_system_summary(db: Session = Depends(get_db)):
    # 1. Total active stations
    total_stations = db.query(Station).filter(Station.status == "Active").count()
    
    # 2. Total active alerts
    active_alerts = db.query(Alert).filter(Alert.status == "Active").count()
    
    # 3. Trains scheduled today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    trains_today = db.query(Schedule).filter(
        Schedule.scheduled_departure >= today_start,
        Schedule.scheduled_departure <= today_end
    ).count()
    
    # 4. Average system passenger utilization ratio
    # Get latest metric for each station
    stations = db.query(Station).all()
    total_capacity = 0
    total_passengers = 0
    
    for s in stations:
        latest_metric = db.query(CrowdMetric).filter(
            CrowdMetric.station_id == s.id
        ).order_by(CrowdMetric.recorded_at.desc()).first()
        
        total_capacity += s.capacity
        if latest_metric:
            total_passengers += latest_metric.passenger_count
            
    avg_utilization = (total_passengers / total_capacity) if total_capacity > 0 else 0
    
    # 5. Delay rate today
    delays_today = db.query(Schedule).filter(
        Schedule.scheduled_departure >= today_start,
        Schedule.scheduled_departure <= today_end,
        Schedule.status == "Delayed"
    ).count()
    
    delay_rate = (delays_today / trains_today) if trains_today > 0 else 0
    
    return {
        "active_stations": total_stations,
        "active_alerts": active_alerts,
        "trains_today": trains_today,
        "system_utilization": round(avg_utilization, 2),
        "delay_rate": round(delay_rate, 2),
        "system_passenger_count": total_passengers
    }

@router.get("/peak-hours")
def get_peak_hours(db: Session = Depends(get_db)):
    # Query crowd metrics from the last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    metrics = db.query(CrowdMetric).filter(
        CrowdMetric.recorded_at >= seven_days_ago
    ).all()
    
    if not metrics:
        return []
        
    # Group by hour and calculate average passenger count
    hourly_data = {}
    for m in metrics:
        hr = m.recorded_at.hour
        if hr not in hourly_data:
            hourly_data[hr] = []
        hourly_data[hr].append(m.passenger_count)
        
    result = []
    for hr in sorted(hourly_data.keys()):
        avg = sum(hourly_data[hr]) / len(hourly_data[hr])
        result.append({
            "hour": f"{hr:02d}:00",
            "avg_passenger_count": int(avg)
        })
        
    return result

@router.get("/station-metrics")
def get_station_metrics(db: Session = Depends(get_db)):
    stations = db.query(Station).all()
    result = []
    
    for s in stations:
        # Get statistics from last 24h
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        metrics = db.query(CrowdMetric).filter(
            CrowdMetric.station_id == s.id,
            CrowdMetric.recorded_at >= one_day_ago
        ).all()
        
        counts = [m.passenger_count for m in metrics] if metrics else [0]
        avg_count = sum(counts) / len(counts)
        max_count = max(counts)
        
        # Get latest metric
        latest = db.query(CrowdMetric).filter(
            CrowdMetric.station_id == s.id
        ).order_by(CrowdMetric.recorded_at.desc()).first()
        current_count = latest.passenger_count if latest else 0
        
        result.append({
            "station_id": s.id,
            "station_name": s.name,
            "code": s.code,
            "capacity": s.capacity,
            "current_count": current_count,
            "avg_24h": int(avg_count),
            "max_24h": max_count,
            "utilization": round(current_count / s.capacity, 2) if s.capacity > 0 else 0
        })
        
    # Sort by utilization descending
    result.sort(key=lambda x: x["utilization"], reverse=True)
    return result

@router.get("/export-reports")
def export_reports(db: Session = Depends(get_db)):
    # Fetch historical crowd metrics for report
    metrics = db.query(CrowdMetric).join(Station).order_by(CrowdMetric.recorded_at.desc()).limit(1000).all()
    
    rows = []
    for m in metrics:
        rows.append({
            "Recorded At": m.recorded_at.strftime("%Y-%m-%d %H:%M:%S"),
            "Station Name": m.station.name,
            "Station Code": m.station.code,
            "Capacity": m.station.capacity,
            "Passenger Count": m.passenger_count,
            "Occupancy %": round((m.passenger_count / m.station.capacity) * 100, 2),
            "Inflow Rate/min": m.inflow_rate,
            "Outflow Rate/min": m.outflow_rate,
            "Weather": m.weather,
            "Special Event Active": m.is_special_event,
            "Holiday": m.is_holiday
        })
        
    df = pd.DataFrame(rows)
    
    # Stream as CSV
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=metroflow_crowd_report.csv"
    return response
