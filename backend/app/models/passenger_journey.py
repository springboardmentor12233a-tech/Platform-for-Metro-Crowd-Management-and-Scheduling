from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin


if TYPE_CHECKING:
    from .station import Station


class PassengerJourney(Base, TimestampMixin):
    __tablename__ = "passenger_journeys"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
         nullable=False,
    )

    # =====================================================
    # Entry Details
    # =====================================================

    entry_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False,
        index=True,
    )

    entry_time: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    entry_gate: Mapped[str | None] = mapped_column(
        String(20)
    )

    # =====================================================
    # Exit Details
    # =====================================================

    exit_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False,
        index=True,
    )

    exit_time: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    exit_gate: Mapped[str | None] = mapped_column(
        String(20)
    )

    # =====================================================
    # Journey Statistics
    # =====================================================

    travel_duration_mins: Mapped[int | None] = mapped_column(
        Integer
    )

    # =====================================================
    # Relationships
    # =====================================================

    entry_station = relationship(
        "Station",
        foreign_keys=[entry_station_id],
        back_populates="entry_passengers",
    )

    exit_station = relationship(
        "Station",
        foreign_keys=[exit_station_id],
        back_populates="exit_passengers",
    )