from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
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
from .enums import CrowdLevel


if TYPE_CHECKING:
    from .station import Station
    from .train import Train


class Occupancy(Base, TimestampMixin):
    __tablename__ = "occupancy"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
         nullable=False,
    )

    # =====================================================
    # Foreign Keys
    # =====================================================

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

    # =====================================================
    # Occupancy Details
    # =====================================================

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    occupancy: Mapped[int | None] = mapped_column(
        Integer
    )

    capacity: Mapped[int | None] = mapped_column(
        Integer
    )

    occupancy_percentage: Mapped[float | None] = mapped_column(
        Float
    )

    crowd_level: Mapped[CrowdLevel | None] = mapped_column(
        Enum(CrowdLevel, name="crowd_level"),
        nullable=True,
    )

    # =====================================================
    # Relationships
    # =====================================================

    train = relationship(
        "Train",
        back_populates="occupancy_records",
    )

    station = relationship(
        "Station",
        back_populates="occupancy_records",
    )