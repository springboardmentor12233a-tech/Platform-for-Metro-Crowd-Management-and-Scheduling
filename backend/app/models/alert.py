from sqlalchemy import Column, Integer, String, DateTime

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station = Column(String(100), nullable=False)
    message = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)
    created_at = Column(DateTime, nullable=False)