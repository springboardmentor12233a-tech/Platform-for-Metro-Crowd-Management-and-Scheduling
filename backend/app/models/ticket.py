from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from .base import Base, TimestampMixin
from .enums import TicketType


if TYPE_CHECKING:
    from .station import Station


class Ticket(Base, TimestampMixin):
    __tablename__ = "tickets"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
    )

    # =====================================================
    # Journey
    # =====================================================

    date: Mapped[date | None] = mapped_column(
        Date,
        index=True,
    )

    from_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False,
        index=True,
    )

    to_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # Fare Information
    # =====================================================

    distance_km: Mapped[float | None] = mapped_column(
        Float
    )

    fare: Mapped[float | None] = mapped_column(
        Float
    )

    cost_per_passenger: Mapped[float | None] = mapped_column(
        Float
    )

    passengers: Mapped[int | None] = mapped_column(
        Integer
    )

    ticket_type: Mapped[TicketType | None] = mapped_column(
        Enum(TicketType, name="ticket_type"),
        nullable=True,
    )

    remarks: Mapped[str | None] = mapped_column(
        String(255)
    )

    fare_per_km: Mapped[float | None] = mapped_column(
        Float
    )

    total_revenue: Mapped[float | None] = mapped_column(
        Float
    )

    cost_exceeds_fare: Mapped[bool | None] = mapped_column(
        Boolean
    )

    # =====================================================
    # Derived Features
    # =====================================================

    year: Mapped[int | None] = mapped_column(
        Integer,
        index=True,
    )

    month: Mapped[int | None] = mapped_column(
        Integer,
        index=True,
    )

    day_of_week: Mapped[str | None] = mapped_column(
        String(20)
    )

    is_weekend: Mapped[bool | None] = mapped_column(
        Boolean
    )

    od_pair: Mapped[str | None] = mapped_column(
        String(120)
    )

    # =====================================================
    # Outlier Flags
    # =====================================================

    distance_km_outlier: Mapped[bool | None] = mapped_column(
        Boolean
    )

    fare_outlier: Mapped[bool | None] = mapped_column(
        Boolean
    )

    cost_per_passenger_outlier: Mapped[bool | None] = mapped_column(
        Boolean
    )

    passengers_outlier: Mapped[bool | None] = mapped_column(
        Boolean
    )

    # =====================================================
    # Relationships
    # =====================================================

    from_station = relationship(
        "Station",
        foreign_keys=[from_station_id],
        back_populates="origin_tickets",
    )

    to_station = relationship(
        "Station",
        foreign_keys=[to_station_id],
        back_populates="destination_tickets",
    )