from sqlalchemy import Text

from sqlalchemy import Column, Integer, String ,Float,DateTime # type: ignore
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    predictions = relationship(
    "PredictionHistory",
    back_populates="user"
)

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    from_station = Column(String)
    to_station = Column(String)

    distance_km = Column(Float)
    fare = Column(Float)
    cost_per_passenger = Column(Float)

    ticket_type = Column(String)
    remarks = Column(String)

    month = Column(String)
    weekday = Column(String)
    hour = Column(Integer)

    weather = Column(String)
    is_holiday = Column(String)
    is_peak_hour = Column(String)

    predicted_passengers = Column(Integer)
    crowd_level = Column(String)
    platform_status = Column(String)
    recommended_train_interval = Column(String)
    extra_trains = Column(Integer)
    recommendation = Column(String)

    prediction_time = Column(DateTime, default=datetime.utcnow)
    alerts = relationship(
    "MetroAlert",
    back_populates="prediction",
    cascade="all, delete-orphan"
)
    user = relationship(
    "User",
    back_populates="predictions"
)

class MetroAlert(Base):
    __tablename__ = "metro_alerts"

    id = Column(Integer, primary_key=True, index=True)

    prediction_id = Column(
        Integer,
        ForeignKey("prediction_history.id"),
        nullable=False
    )

    priority = Column(String)
    title = Column(String)
    message = Column(String)
    recommendation = Column(String)
    passenger_advisory = Column(String)
    notification_type = Column(String)
    announcement = Column(Text)

    status = Column(String, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)

    prediction = relationship("PredictionHistory", back_populates="alerts")