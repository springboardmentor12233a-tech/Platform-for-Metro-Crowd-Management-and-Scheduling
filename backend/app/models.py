import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False, index=True)
    code = Column(String(10), unique=True, nullable=False, index=True)
    capacity = Column(Integer, nullable=False)
    status = Column(String(20), default="Active", nullable=False)  # Active, Maintenance, Closed
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    users = relationship("User", back_populates="station")
    crowd_metrics = relationship("CrowdMetric", back_populates="station", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="station", cascade="all, delete-orphan")
    
    # Explicit foreign keys for schedules to prevent ambiguous joins
    departure_schedules = relationship(
        "Schedule", 
        foreign_keys="[Schedule.departure_station_id]", 
        back_populates="departure_station",
        cascade="all, delete-orphan"
    )
    arrival_schedules = relationship(
        "Schedule", 
        foreign_keys="[Schedule.arrival_station_id]", 
        back_populates="arrival_station",
        cascade="all, delete-orphan"
    )


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="passenger", nullable=False)  # admin, operator, station_master, passenger
    station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    station = relationship("Station", back_populates="users")
    resolved_alerts = relationship("Alert", back_populates="resolver")
    audit_logs = relationship("AuditLog", back_populates="user")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    train_id = Column(String(20), nullable=False, index=True)
    line_name = Column(String(50), nullable=False, index=True)
    direction = Column(String(20), nullable=False)  # Inbound, Outbound
    departure_station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    arrival_station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    scheduled_departure = Column(DateTime, nullable=False, index=True)
    scheduled_arrival = Column(DateTime, nullable=False)
    actual_departure = Column(DateTime, nullable=True)
    actual_arrival = Column(DateTime, nullable=True)
    status = Column(String(20), default="Scheduled", nullable=False)  # Scheduled, On-Time, Delayed, Cancelled, Completed

    # Relationships
    departure_station = relationship("Station", foreign_keys=[departure_station_id], back_populates="departure_schedules")
    arrival_station = relationship("Station", foreign_keys=[arrival_station_id], back_populates="arrival_schedules")


class CrowdMetric(Base):
    __tablename__ = "crowd_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False, index=True)
    passenger_count = Column(Integer, nullable=False)
    inflow_rate = Column(Integer, nullable=False)
    outflow_rate = Column(Integer, nullable=False)
    weather = Column(String(20), default="Clear", nullable=False)  # Clear, Rainy, Snowy, Stormy
    is_special_event = Column(Boolean, default=False, nullable=False)
    is_holiday = Column(Boolean, default=False, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    station = relationship("Station", back_populates="crowd_metrics")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False, index=True)
    severity = Column(String(20), default="Info", nullable=False)  # Info, Warning, Critical
    description = Column(String(255), nullable=False)
    status = Column(String(20), default="Active", nullable=False)  # Active, Acknowledged, Resolved
    triggered_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    station = relationship("Station", back_populates="alerts")
    resolver = relationship("User", back_populates="resolved_alerts")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(50), nullable=False)  # LOGIN, LOGOUT, CREATE_SCHEDULE, etc.
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="audit_logs")
