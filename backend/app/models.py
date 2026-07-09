from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy import DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, index=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(20), nullable=False, default="Operator")
    

class CrowdData(Base):
    __tablename__ = "crowd_data"

    id = Column(Integer, primary_key=True, index=True)

    station_name = Column(String(100), nullable=False)

    passenger_count = Column(Integer, nullable=False)

    crowd_level = Column(String(20), nullable=False)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )
