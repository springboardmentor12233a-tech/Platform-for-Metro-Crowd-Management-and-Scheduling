from sqlalchemy import Column, Integer, String, Time, ForeignKey
from app.database.base import Base


class TrainSchedule(Base):
    __tablename__ = "train_schedules"

    schedule_id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.route_id"))
    station_id = Column(Integer, ForeignKey("stations.station_id"))
    train_id = Column(Integer, ForeignKey("trains.train_id"))

    arrival_time = Column(Time)
    departure_time = Column(Time)

    day_type = Column(String(20))