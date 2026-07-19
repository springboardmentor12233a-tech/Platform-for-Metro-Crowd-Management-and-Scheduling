from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database.db import Base


class PeriodType(str, enum.Enum):
    peak = "peak"
    off_peak = "off_peak"
    weekend = "weekend"


class Train(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_code = Column(String, unique=True, index=True, nullable=False)  # e.g. "BL-101"
    line = Column(String, nullable=False)  # e.g. "Blue line"
    capacity = Column(Integer, default=300)  # max passengers
    is_active = Column(Integer, default=1)  # 1 = in service, 0 = under maintenance

    schedules = relationship("Schedule", back_populates="train")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.id"), nullable=False)
    from_station = Column(String, nullable=False)
    to_station = Column(String, nullable=False)
    departure_time = Column(String, nullable=False)  # "HH:MM", simple for now
    arrival_time = Column(String, nullable=False)
    frequency_minutes = Column(Integer, nullable=False)  # headway/gap between trains
    period = Column(Enum(PeriodType), default=PeriodType.off_peak)
    delay_minutes = Column(Integer, default=0)  # live delay pushed by operators
    status_note = Column(String, nullable=True)  # e.g. "Running late due to signal fault"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    train = relationship("Train", back_populates="schedules")