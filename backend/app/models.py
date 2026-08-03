from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(60), unique=True, index=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    role = Column(String(30), nullable=False, default="operator")
    assigned_station = Column(String(160), nullable=True)
    hashed_password = Column(String(255), nullable=False)


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), unique=True, nullable=False, index=True)
    line = Column(String(80), nullable=True)
    capacity = Column(Integer, nullable=False, default=250)


class PassengerFlow(Base):
    __tablename__ = "passenger_flows"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, index=True)
    travel_date = Column(Date, index=True, nullable=False)
    from_station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    to_station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    distance_km = Column(Float, default=0)
    fare = Column(Float, default=0)
    cost_per_passenger = Column(Float, default=0)
    passengers = Column(Float, default=0)
    ticket_type = Column(String(60), default="Unknown")
    remarks = Column(String(60), default="normal")

    from_station = relationship("Station", foreign_keys=[from_station_id])
    to_station = relationship("Station", foreign_keys=[to_station_id])


class TrainSchedule(Base):
    __tablename__ = "train_schedules"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(40), unique=True, index=True, nullable=False)
    line = Column(String(80), nullable=False)
    source_station = Column(String(160), nullable=False)
    destination_station = Column(String(160), nullable=False)
    departure_time = Column(String(20), nullable=False)
    arrival_time = Column(String(20), nullable=False)
    frequency_minutes = Column(Integer, nullable=False, default=8)
    recommended_frequency = Column(Integer, nullable=False, default=8)
    expected_load = Column(Integer, nullable=False, default=0)
    delay_minutes = Column(Integer, nullable=False, default=0)
    status = Column(String(40), nullable=False, default="On Time")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    station_name = Column(String(160), nullable=True)
    severity = Column(String(30), nullable=False, default="Low")
    category = Column(String(60), nullable=False, default="crowd")
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EmergencyAnnouncement(Base):
    __tablename__ = "emergency_announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    message = Column(Text, nullable=False)
    target_station = Column(String(160), nullable=True)
    priority = Column(String(30), nullable=False, default="Normal")
    created_by = Column(String(60), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OperationalUpdate(Base):
    __tablename__ = "operational_updates"

    id = Column(Integer, primary_key=True, index=True)
    update_type = Column(String(60), nullable=False)
    line = Column(String(80), nullable=True)
    station_name = Column(String(160), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(40), nullable=False, default="Open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
