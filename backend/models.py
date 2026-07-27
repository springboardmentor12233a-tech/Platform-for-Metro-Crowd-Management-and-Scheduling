from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Time, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="operator")

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, unique=True, index=True)
    route_code = Column(String)
    route_name = Column(String)
    route_type = Column(Integer)
    route_color = Column(String)


class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, unique=True, index=True)
    route_id = Column(Integer)
    service_id = Column(String)
    shape_id = Column(String)

class StationCrowdData(Base):
    __tablename__ = "station_crowd_data"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, index=True)
    timestamp = Column(DateTime, index=True)
    crowd_level = Column(Integer)  # 1-5 scale
    passenger_count = Column(Integer)
    capacity_percentage = Column(Float)

class TrafficPattern(Base):
    __tablename__ = "traffic_patterns"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, index=True)
    day_of_week = Column(String)  # Mon, Tue, etc
    hour = Column(Integer)  # 0-23
    avg_passengers = Column(Integer)
    peak_status = Column(String)  # "peak" or "off-peak"

class PassengerDemandForecast(Base):
    __tablename__ = "passenger_demand_forecast"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, index=True)
    route_id = Column(Integer, index=True)
    forecast_date = Column(Date, index=True)
    forecast_hour = Column(Integer)
    predicted_passengers = Column(Integer)
    confidence_score = Column(Float)

class AlertNotification(Base):
    __tablename__ = "alert_notifications"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, index=True)
    alert_type = Column(String)  # "overcrowding", "delay", etc
    message = Column(String)
    severity = Column(String)  # "low", "medium", "high"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

# backend/models.py - Train Scheduling Database Models
# Using SQLAlchemy ORM for PostgreSQL
# ============================================================================
# TRAIN SCHEDULING MODELS
# ============================================================================

class Train(Base):
    """Train entity with basic information"""
    __tablename__ = "trains"
    
    train_id = Column(Integer, primary_key=True, index=True)
    train_name = Column(String(50), unique=True, index=True)  # e.g., "Red Line T-101"
    line_id = Column(Integer, ForeignKey("metro_lines.line_id"))
    capacity = Column(Integer)  # Max passengers
    status = Column(String(20), default="ACTIVE")  # ACTIVE, MAINTENANCE, INACTIVE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    schedules = relationship("TrainSchedule", back_populates="train")
    occupancy = relationship("TrainOccupancy", back_populates="train")


class MetroLine(Base):
    """Metro line/route information"""
    __tablename__ = "metro_lines"
    
    line_id = Column(Integer, primary_key=True, index=True)
    line_name = Column(String(100), unique=True, index=True)  # e.g., "Red Line"
    line_code = Column(String(10), unique=True)  # e.g., "RL"
    start_station = Column(String(100))
    end_station = Column(String(100))
    total_stations = Column(Integer)
    total_distance_km = Column(Float)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    schedules = relationship("TrainSchedule", back_populates="metro_line")
    stations = relationship("Station", back_populates="metro_line")


class Station(Base):
    """Metro stations on each line"""
    __tablename__ = "stations"
    
    station_id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String(100), index=True)
    line_id = Column(Integer, ForeignKey("metro_lines.line_id"))
    station_sequence = Column(Integer)  # Order in line
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    metro_line = relationship("MetroLine", back_populates="stations")
    stop_times = relationship("StopTime", back_populates="station")
    passenger_data = relationship("PassengerFlow", back_populates="station")


class TrainSchedule(Base):
    """Train schedule/timetable"""
    __tablename__ = "train_schedules"
    
    schedule_id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.train_id"))
    line_id = Column(Integer, ForeignKey("metro_lines.line_id"))
    
    # Schedule info
    departure_time = Column(Time)  # e.g., 08:00:00
    arrival_time = Column(Time)
    frequency_minutes = Column(Integer)  # Frequency in minutes (e.g., 5, 10, 15)
    day_of_week = Column(String(20))  # "WEEKDAY", "WEEKEND", "DAILY"
    is_peak_hour = Column(Boolean, default=False)
    
    # Route info
    route_distance_km = Column(Float)
    estimated_travel_time_min = Column(Integer)
    
    # Status & Tracking
    actual_departure = Column(Time, nullable=True)  # Actual vs scheduled
    actual_arrival = Column(Time, nullable=True)
    delay_minutes = Column(Integer, default=0)
    status = Column(String(20), default="SCHEDULED")  # SCHEDULED, RUNNING, COMPLETED, DELAYED, CANCELLED
    
    # Occupancy
    estimated_passengers = Column(Integer, default=0)
    actual_passengers = Column(Integer, nullable=True)
    occupancy_percentage = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    date = Column(DateTime, default=datetime.utcnow)  # Date of schedule
    
    # Relationships
    train = relationship("Train", back_populates="schedules")
    metro_line = relationship("MetroLine", back_populates="schedules")
    stop_times = relationship("StopTime", back_populates="schedule")


class StopTime(Base):
    """Train stop times at each station"""
    __tablename__ = "stop_times"
    
    stop_id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("train_schedules.schedule_id"))
    station_id = Column(Integer, ForeignKey("stations.station_id"))
    
    # Timing
    arrival_time = Column(Time)
    departure_time = Column(Time)
    stop_sequence = Column(Integer)
    dwell_time_seconds = Column(Integer)  # Time spent at station
    
    # Actual vs Planned
    actual_arrival = Column(Time, nullable=True)
    actual_departure = Column(Time, nullable=True)
    delay_minutes = Column(Integer, default=0)
    
    # Passenger info
    passengers_boarding = Column(Integer, default=0)
    passengers_alighting = Column(Integer, default=0)
    train_occupancy_after_stop = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    schedule = relationship("TrainSchedule", back_populates="stop_times")
    station = relationship("Station", back_populates="stop_times")


class TrainOccupancy(Base):
    """Real-time train occupancy tracking"""
    __tablename__ = "train_occupancy"
    
    occupancy_id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.train_id"))
    schedule_id = Column(Integer, ForeignKey("train_schedules.schedule_id"), nullable=True)
    
    # Current state
    current_passengers = Column(Integer)
    capacity = Column(Integer)
    occupancy_percentage = Column(Float)
    
    # Time info
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    location = Column(String(100))  # Current station or between stations
    
    # Comfort level
    crowding_level = Column(String(20))  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    train = relationship("Train", back_populates="occupancy")


class PassengerFlow(Base):
    """Passenger entry/exit data for demand forecasting"""
    __tablename__ = "passenger_flow"
    
    flow_id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.station_id"))
    
    # Time info
    timestamp = Column(DateTime, index=True)
    hour = Column(Integer)  # 0-23
    day_of_week = Column(String(20))
    date = Column(DateTime)
    
    # Flow data
    passengers_entering = Column(Integer)
    passengers_exiting = Column(Integer)
    net_flow = Column(Integer)  # entering - exiting
    
    # Peak info
    is_peak_hour = Column(Boolean, default=False)
    peak_level = Column(String(20), nullable=True)  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    station = relationship("Station", back_populates="passenger_data")


class ScheduleOptimization(Base):
    """Track schedule optimizations and frequency adjustments"""
    __tablename__ = "schedule_optimizations"
    
    optimization_id = Column(Integer, primary_key=True, index=True)
    line_id = Column(Integer, ForeignKey("metro_lines.line_id"))
    
    # Optimization details
    optimization_type = Column(String(50))  # "FREQUENCY_INCREASE", "FREQUENCY_DECREASE", "SCHEDULE_SHIFT"
    current_frequency_minutes = Column(Integer)
    recommended_frequency_minutes = Column(Integer)
    reason = Column(String(500))  # Why optimization recommended
    
    # Impact metrics
    expected_reduction_wait_time_min = Column(Float)
    expected_reduction_crowding_pct = Column(Float)
    expected_cost_impact = Column(String(50))  # "MINIMAL", "MODERATE", "HIGH"
    
    # Status
    status = Column(String(20), default="PENDING")  # PENDING, APPROVED, IMPLEMENTED, REJECTED
    confidence_score = Column(Float)  # 0-1, confidence in recommendation
    
    created_at = Column(DateTime, default=datetime.utcnow)
    implemented_at = Column(DateTime, nullable=True)
    
    
class ScheduleAlert(Base):
    """Alerts for schedule disruptions and issues"""
    __tablename__ = "schedule_alerts"
    
    alert_id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("train_schedules.schedule_id"))
    line_id = Column(Integer, ForeignKey("metro_lines.line_id"))
    
    # Alert info
    alert_type = Column(String(50))  # "DELAY", "CANCELLATION", "CROWDING", "MAINTENANCE"
    severity = Column(String(20))  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    message = Column(String(500))
    
    # Affected passengers
    estimated_affected_passengers = Column(Integer, default=0)
    
    # Status
    status = Column(String(20), default="ACTIVE")  # ACTIVE, RESOLVED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


# ============================================================================
# PYDANTIC SCHEMAS (for API validation)
# ============================================================================

from pydantic import BaseModel
from typing import List, Optional
from datetime import time, date

class TrainScheduleCreate(BaseModel):
    train_id: int
    line_id: int
    departure_time: time
    arrival_time: time
    frequency_minutes: int
    day_of_week: str
    route_distance_km: float
    estimated_travel_time_min: int
    estimated_passengers: int = 0


class TrainScheduleUpdate(BaseModel):
    frequency_minutes: Optional[int] = None
    delay_minutes: Optional[int] = None
    status: Optional[str] = None
    actual_passengers: Optional[int] = None
    occupancy_percentage: Optional[float] = None


class TrainScheduleResponse(BaseModel):
    schedule_id: int
    train_id: int
    line_id: int
    departure_time: time
    arrival_time: time
    frequency_minutes: int
    day_of_week: str
    delay_minutes: int
    status: str
    occupancy_percentage: Optional[float]
    
    class Config:
        from_attributes = True


class FrequencyAdjustmentRequest(BaseModel):
    line_id: int
    current_frequency: int
    peak_hour_start: int  # 0-23
    peak_hour_end: int
    date: date


class OptimizationResponse(BaseModel):
    line_id: int
    current_frequency_minutes: int
    recommended_frequency_minutes: int
    reason: str
    confidence_score: float
    expected_reduction_wait_time_min: float


class ScheduleAlertResponse(BaseModel):
    alert_id: int
    alert_type: str
    severity: str
    message: str
    estimated_affected_passengers: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
