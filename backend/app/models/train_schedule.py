from sqlalchemy import Column, Integer, String, Time

from app.database.database import Base


class TrainSchedule(Base):
    __tablename__ = "train_schedule"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(20))
    arrival_time = Column(Time)
    departure_time = Column(Time)
    delay_minutes = Column(Integer)