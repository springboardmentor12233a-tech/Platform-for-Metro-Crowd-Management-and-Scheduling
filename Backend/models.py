from sqlalchemy import Column, Integer, String
from database import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, default=1000)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="operator")

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)
    departure_time = Column(String, nullable=False)
    frequency_minutes = Column(Integer, default=10)
    status = Column(String, default="On Time")
