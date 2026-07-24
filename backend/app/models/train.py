from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.base import Base


class Train(Base):
    __tablename__ = "trains"

    train_id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(20), unique=True, nullable=False)
    train_name = Column(String(100), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.route_id"))
    capacity = Column(Integer, nullable=False)
    status = Column(String(20), default="Active")