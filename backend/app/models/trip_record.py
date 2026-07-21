from sqlalchemy import Column, Integer, String, Float

from app.database import Base


class TripRecord(Base):
    __tablename__ = "trip_records"

    id = Column(Integer, primary_key=True, index=True)

    trip_id = Column(Integer, unique=True, nullable=False)

    trip_date = Column(String(30), nullable=False)

    from_station = Column(String(150), nullable=False)

    to_station = Column(String(150), nullable=False)

    distance_km = Column(Float)

    fare = Column(Float)

    cost_per_passenger = Column(Float)

    passengers = Column(Integer)

    ticket_type = Column(String(50))

    remarks = Column(String(100))