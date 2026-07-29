from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin


if TYPE_CHECKING:
    from .station import Station
    from .train import Train


class Trip(Base, TimestampMixin):
    __tablename__ = "trips"

    # ==========================
    # Primary Key
    # ==========================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True
    )

    # ==========================
    # Foreign Keys
    # ==========================

    train_id: Mapped[str] = mapped_column(
        ForeignKey("trains.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    origin_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    destination_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    # ==========================
    # Trip Details
    # ==========================

    departure_time: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    arrival_time: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    trip_date: Mapped[date | None] = mapped_column(
        Date
    )

    trip_duration_min: Mapped[int | None] = mapped_column(
        Integer
    )

    distance_km: Mapped[float | None] = mapped_column(
        Float
    )

    average_speed_kmh: Mapped[float | None] = mapped_column(
        Float
    )

    # ==========================
    # Relationships
    # ==========================

    train = relationship(
        "Train",
        back_populates="trips"
    )

    origin_station = relationship(
        "Station",
        foreign_keys=[origin_station_id],
        back_populates="origin_trips"
    )

    destination_station = relationship(
        "Station",
        foreign_keys=[destination_station_id],
        back_populates="destination_trips"
    )