from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(60), unique=True, index=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    role = Column(String(30), nullable=False, default="operator")
    hashed_password = Column(String(255), nullable=False)


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), unique=True, nullable=False, index=True)
    line = Column(String(80), nullable=True)
    capacity = Column(Integer, nullable=False, default=10000)


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
