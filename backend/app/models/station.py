from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, TIMESTAMP
from sqlalchemy.sql import func
from app.database.base import Base


class Station(Base):
    __tablename__ = "stations"

    station_id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String(120), nullable=False)
    line_name = Column(String(100), nullable=False)
    distance_from_start = Column(Numeric(6, 2))
    opening_date = Column(Date)
    station_layout = Column(String(50))
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    is_interchange = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())