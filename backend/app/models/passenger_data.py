from sqlalchemy import Column, Integer, Date, Time, DateTime, ForeignKey, func

from app.database.base import Base


class PassengerData(Base):
    __tablename__ = "passenger_data"

    passenger_id = Column(Integer, primary_key=True, index=True)

    station_id = Column(Integer, ForeignKey("stations.station_id"))
    route_id = Column(Integer, ForeignKey("routes.route_id"))
    train_id = Column(Integer, ForeignKey("trains.train_id"))

    travel_date = Column(Date, nullable=False)
    travel_time = Column(Time, nullable=False)

    passenger_count = Column(Integer, nullable=False)

    created_at = Column(DateTime, server_default=func.now())