from __future__ import annotations

from datetime import time
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin
from .enums import DayType


if TYPE_CHECKING:
    from .station import Station
    from .train import Train


class Schedule(Base, TimestampMixin):
    __tablename__ = "schedules"

    # ==================================================
    # PRIMARY KEY
    # ==================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
         nullable=False,
    )

    # ==================================================
    # FOREIGN KEYS
    # ==================================================

    train_id: Mapped[str] = mapped_column(
        ForeignKey("trains.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ==================================================
    # SCHEDULE DETAILS
    # ==================================================

    arrival_time: Mapped[time | None] = mapped_column(
        Time
    )

    departure_time: Mapped[time | None] = mapped_column(
        Time
    )

    stop_sequence: Mapped[int | None] = mapped_column(
        Integer
    )

    day_type: Mapped[DayType | None] = mapped_column(
        Enum(DayType, name="day_type"),
        nullable=True,
    )

    platform: Mapped[str | None] = mapped_column(
        String(20)
    )

    # ==================================================
    # RELATIONSHIPS
    # ==================================================

    train = relationship(
        "Train",
        back_populates="schedules",
    )

    station = relationship(
        "Station",
        back_populates="schedules",
    )