from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Date
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="operator")


class Station(Base):
    __tablename__ = "stations"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, unique=True, index=True)
    name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)


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


class StopTime(Base):
    __tablename__ = "stop_times"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, index=True)
    stop_id = Column(Integer, index=True)
    arrival_time = Column(String)
    departure_time = Column(String)
    stop_sequence = Column(Integer)

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

class TrainOccupancy(Base):
    __tablename__ = "train_occupancy"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, index=True)
    station_id = Column(Integer, index=True)
    occupancy_percentage = Column(Float)
    current_passengers = Column(Integer)
    capacity = Column(Integer)
    timestamp = Column(DateTime, index=True)

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