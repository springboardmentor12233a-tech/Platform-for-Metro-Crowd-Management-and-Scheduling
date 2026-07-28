from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)

    station_name = Column(String(100), nullable=False)

    risk_level = Column(String(30), nullable=False)

    summary = Column(Text, nullable=False)

    recommendation = Column(Text, nullable=False)

    operational_action = Column(Text, nullable=False)

    expected_impact = Column(Text, nullable=False)

    confidence = Column(Integer, default=95)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )