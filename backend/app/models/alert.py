from sqlalchemy import Column, Integer, String, DateTime

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station = Column(String(100))
    message = Column(String(255))
    severity = Column(String(20))
    created_at = Column(DateTime)