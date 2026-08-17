from sqlalchemy import Column, Integer, String, Time

from app.database.database import Base


class TrainSchedule(Base):
    __tablename__ = "train_schedules"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    train_id = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
    )

    line = Column(
        String(50),
        nullable=False,
    )

    from_station = Column(
        String(150),
        nullable=False,
    )

    to_station = Column(
        String(150),
        nullable=False,
    )

    departure_time = Column(
        Time,
        nullable=False,
    )

    arrival_time = Column(
        Time,
        nullable=False,
    )

    platform = Column(
        String(50),
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="On Time",
    )

    ai_suggestion = Column(
        String(500),
        nullable=True,
    )