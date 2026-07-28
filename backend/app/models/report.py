from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    report_type = Column(String(100), nullable=False)

    export_format = Column(String(20), nullable=False)

    network_status = Column(String(100))

    busiest_station = Column(String(200))

    summary = Column(Text)

    recommendations = Column(Text)

    operational_actions = Column(Text)

    expected_impact = Column(Text)

    confidence = Column(Float)

    total_passengers = Column(Integer)

    total_revenue = Column(Float)

    total_trips = Column(Integer)

    total_stations = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )