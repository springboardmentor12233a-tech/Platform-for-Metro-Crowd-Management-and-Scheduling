from sqlalchemy import Column, Integer, String
from app.database.base import Base


class Route(Base):
    __tablename__ = "routes"

    route_id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String(100), nullable=False, unique=True)
    route_color = Column(String(30), nullable=True)
    total_stations = Column(Integer, default=0)