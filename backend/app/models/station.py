from sqlalchemy import Column, Integer, String, Float

from app.database.database import Base


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)

    station_name = Column(String(150), nullable=False)
    line = Column(String(100), nullable=False)

    distance_from_start = Column(Float)

    opening_date = Column(String(30))

    station_layout = Column(String(50))

    latitude = Column(Float)

    longitude = Column(Float)

    # Useful for crowd management
    capacity = Column(Integer, default=2000)