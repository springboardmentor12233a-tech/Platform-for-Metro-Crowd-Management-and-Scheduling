from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    TIMESTAMP,
    Text
)
from sqlalchemy.sql import func

from app.database.base import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    prediction_id = Column(Integer, primary_key=True, index=True)

    prediction_time = Column(TIMESTAMP, server_default=func.now())

    from_station = Column(String(120), nullable=False)
    to_station = Column(String(120), nullable=False)

    hour = Column(Integer, nullable=False)
    day_name = Column(String(20), nullable=False)
    month = Column(Integer, nullable=False)

    weather = Column(String(50), nullable=False)
    ticket_type = Column(String(50), nullable=False)

    is_holiday = Column(Boolean, default=False)
    is_interchange = Column(Boolean, default=False)

    distance_km = Column(Float, nullable=False)

    predicted_passengers = Column(Integer, nullable=False)

    crowd_level = Column(String(30), nullable=False)

    recommendations = Column(Text)

    alert_status = Column(Boolean, default=False)
    alert_severity = Column(String(30))
    alert_type = Column(String(50))
    alert_message = Column(Text)