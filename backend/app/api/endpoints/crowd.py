from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Station, CrowdMetric
from app.schemas import CrowdForecastRequest, CrowdForecastResponse, CrowdMetricResponse
from app.services.ml_service import ml_service
from datetime import datetime, timedelta
import uuid

router = APIRouter()

@router.get("/{station_id}/live", response_model=CrowdMetricResponse)
def get_live_metrics(station_id: uuid.UUID, db: Session = Depends(get_db)):
    # Get latest crowd metric for this station
    metric = db.query(CrowdMetric).filter(
        CrowdMetric.station_id == station_id
    ).order_by(CrowdMetric.recorded_at.desc()).first()
    
    if not metric:
        # Fallback to creating a new mock metric so the UI doesn't break
        station = db.query(Station).filter(Station.id == station_id).first()
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        # Write default metric
        metric = CrowdMetric(
            id=uuid.uuid4(),
            station_id=station_id,
            passenger_count=int(station.capacity * 0.1),
            inflow_rate=20,
            outflow_rate=15,
            weather="Clear",
            is_special_event=False,
            is_holiday=False,
            recorded_at=datetime.utcnow()
        )
        db.add(metric)
        db.commit()
        db.refresh(metric)
        
    return metric

@router.post("/forecast", response_model=CrowdForecastResponse)
def predict_crowd_volume(request: CrowdForecastRequest, db: Session = Depends(get_db)):
    # Find capacity of station
    station = db.query(Station).filter(Station.code == request.station_code).first()
    capacity = station.capacity if station else 3000
    
    pred_count = ml_service.predict(
        station_code=request.station_code,
        hour=request.hour_of_day,
        day_of_week=request.day_of_week,
        month=request.month,
        is_holiday=request.is_holiday,
        is_special_event=request.is_special_event,
        weather=request.weather,
        lag_passenger_count=request.lag_passenger_count
    )
    
    ratio = pred_count / capacity
    if ratio > 0.85:
        level = "Overcrowded"
        rec = "Critical congestion expected. Deploy standby trains, alert station control, and consider platform queuing limits."
    elif ratio > 0.60:
        level = "Busy"
        rec = "High passenger volume expected. Reduce train headway, monitor escalator bottlenecks, and adjust display boards."
    elif ratio > 0.30:
        level = "Moderate"
        rec = "Standard operations. Monitor platform flow."
    else:
        level = "Low"
        rec = "Normal operations. Optimize energy efficiency."
        
    return CrowdForecastResponse(
        predicted_passenger_count=pred_count,
        predicted_occupancy_ratio=round(ratio, 2),
        crowd_level=level,
        recommendation=rec
    )

@router.get("/{station_id}/forecast-24h", response_model=List[CrowdForecastResponse])
def get_24h_forecast(station_id: uuid.UUID, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
        
    # Get current state from latest metric
    latest_metric = db.query(CrowdMetric).filter(
        CrowdMetric.station_id == station_id
    ).order_by(CrowdMetric.recorded_at.desc()).first()
    
    lag_count = latest_metric.passenger_count if latest_metric else int(station.capacity * 0.15)
    
    forecasts = []
    start_time = datetime.utcnow()
    
    # Run predictions hour by hour for 24 hours
    for h in range(1, 25):
        target_time = start_time + timedelta(hours=h)
        hr_of_day = target_time.hour
        day_of_wk = target_time.weekday()
        mnth = target_time.month
        
        # Call model using current lag count
        pred_count = ml_service.predict(
            station_code=station.code,
            hour=hr_of_day,
            day_of_week=day_of_wk,
            month=mnth,
            is_holiday=(day_of_wk == 6),
            is_special_event=False,
            weather="Clear",
            lag_passenger_count=lag_count
        )
        
        ratio = pred_count / station.capacity
        if ratio > 0.85:
            level = "Overcrowded"
            rec = "Critical congestion. Reduce train headways immediately."
        elif ratio > 0.60:
            level = "Busy"
            rec = "High ridership. Adjust schedule capacity."
        elif ratio > 0.30:
            level = "Moderate"
            rec = "Standard flow. Operational stability."
        else:
            level = "Low"
            rec = "Off-peak capacity. Regular services."
            
        forecasts.append(
            CrowdForecastResponse(
                predicted_passenger_count=pred_count,
                predicted_occupancy_ratio=round(ratio, 2),
                crowd_level=level,
                recommendation=rec
            )
        )
        # Shift lag count for next iteration
        lag_count = pred_count
        
    return forecasts
