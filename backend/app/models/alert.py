from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.database.db import Base


class AlertType(str, enum.Enum):
    overcrowding = "overcrowding"
    delay = "delay"
    emergency = "emergency"
    maintenance = "maintenance"


class AlertSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(Enum(AlertType), nullable=False)
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.medium)
    station = Column(String, nullable=True)  # null for network-wide announcements
    message = Column(String, nullable=False)
    created_by = Column(String, nullable=False)  # email of the admin who raised it
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)