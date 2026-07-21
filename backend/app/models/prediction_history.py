from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)

    from_station = Column(String(150))
    to_station = Column(String(150))

    distance_km = Column(Float)
    fare = Column(Float)
    cost_per_passenger = Column(Float)

    ticket_type = Column(String(50))
    remarks = Column(String(100))

    predicted_passengers = Column(Float)

    crowd_level = Column(String(30))

    recommendation = Column(String(255))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )