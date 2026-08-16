from __future__ import annotations

from typing import TYPE_CHECKING
from datetime import date

from sqlalchemy import Boolean, Float, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin


if TYPE_CHECKING:
    from .train import Train
    from .schedules import Schedule
    from .trip import Trip
    from .ticket import Ticket
    from .passenger_journey import PassengerJourney
    from .occupancy import Occupancy
    from .sensor_telemetry import SensorTelemetry
    from .crowd_history import CrowdHistory
    from .crowd_prediction import CrowdPrediction
    from .schedule_prediction import SchedulePrediction
    from .delay import Delay


class Station(Base, TimestampMixin):

    __tablename__ = "stations"

    # ---------------------------------------------------------
    # PRIMARY KEY
    # ---------------------------------------------------------

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )

    # ---------------------------------------------------------
    # STATION INFORMATION
    # ---------------------------------------------------------

    station_name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    distance_from_start_km: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    line: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )

    opening_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    station_layout: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    coord_invalid: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    distance_from_start_km_outlier: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    opening_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # ---------------------------------------------------------
    # RELATIONSHIPS
    # ---------------------------------------------------------
# ---------------------------------------------------------
    # RELATIONSHIPS
    # ---------------------------------------------------------

    trains = relationship(
        "Train",
        back_populates="current_station",
    )

    schedules = relationship(
        "Schedule",
        back_populates="station",
        cascade="all, delete-orphan",
    )

    origin_trips = relationship(
        "Trip",
        foreign_keys="Trip.origin_station_id",
        back_populates="origin_station",
    )

    destination_trips = relationship(
        "Trip",
        foreign_keys="Trip.destination_station_id",
        back_populates="destination_station",
    )

    origin_tickets = relationship(
        "Ticket",
        foreign_keys="Ticket.from_station_id",
        back_populates="from_station",
    )

    destination_tickets = relationship(
        "Ticket",
        foreign_keys="Ticket.to_station_id",
        back_populates="to_station",
    )

    entry_passengers = relationship(
        "PassengerJourney",
        foreign_keys="PassengerJourney.entry_station_id",
        back_populates="entry_station",
    )

    exit_passengers = relationship(
        "PassengerJourney",
        foreign_keys="PassengerJourney.exit_station_id",
        back_populates="exit_station",
    )

    occupancy_records = relationship(
        "Occupancy",
        back_populates="station",
        cascade="all, delete-orphan",
    )

    sensor_records = relationship(
        "SensorTelemetry",
        back_populates="station",
        cascade="all, delete-orphan",
    )

    crowd_history = relationship(
        "CrowdHistory",
        back_populates="station",
        cascade="all, delete-orphan",
    )

    crowd_predictions = relationship(
        "CrowdPrediction",
        back_populates="station",
        cascade="all, delete-orphan",
    )

    delay_origins = relationship(
        "Delay",
        foreign_keys="Delay.origin_station_id",
        back_populates="origin_station",
        cascade="all, delete-orphan",
    )

    delay_destinations = relationship(
        "Delay",
        foreign_keys="Delay.destination_station_id",
        back_populates="destination_station",
        cascade="all, delete-orphan",
    )

    ridership_predictions = relationship(
        "RidershipPrediction",
        back_populates="station",
        cascade="all, delete-orphan",
    )
    schedule_predictions = relationship(
        "SchedulePrediction",
        back_populates="station",
        cascade="all, delete-orphan",
    )

   