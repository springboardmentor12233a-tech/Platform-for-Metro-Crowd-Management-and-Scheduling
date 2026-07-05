from sqlalchemy import Column, Integer, ForeignKey, Date, Time
from sqlalchemy.orm import relationship

from app.database.database import Base


class PassengerFlow(Base):
    __tablename__ = "passenger_flow"

    id = Column(Integer, primary_key=True, index=True)

    station_id = Column(
        Integer,
        ForeignKey("stations.id"),
        nullable=False,
    )

    flow_date = Column(Date, nullable=False)
    flow_time = Column(Time, nullable=False)

    passengers_in = Column(Integer, default=0)
    passengers_out = Column(Integer, default=0)

    occupancy = Column(Integer, default=0)

    station = relationship("Station")