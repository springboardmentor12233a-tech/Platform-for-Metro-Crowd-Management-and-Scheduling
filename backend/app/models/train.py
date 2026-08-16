from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin
from .enums import TrainStatus


if TYPE_CHECKING:
    from .delay import Delay
    from .occupancy import Occupancy
    from .schedules import Schedule
    from .station import Station
    from .trip import Trip


class Train(Base, TimestampMixin):
    __tablename__ = "trains"

    # ==================================================
    # PRIMARY KEY
    # ==================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
         nullable=False,
    )

    # ==================================================
    # TRAIN DETAILS
    # ==================================================

    train_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    train_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    line: Mapped[str | None] = mapped_column(
        String(50),
        index=True,
        nullable=True,
    )

    capacity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # ==================================================
    # CURRENT LOCATION
    # ==================================================

    current_station_id: Mapped[int | None] = mapped_column(
        ForeignKey("stations.id"),
        nullable=True,
        index=True,
    )

    # ==================================================
    # OPERATIONAL INFO
    # ==================================================

    status: Mapped[TrainStatus | None] = mapped_column(
        Enum(TrainStatus, name="train_status"),
        nullable=True,
    )

    speed_limit_kmh: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    manufacturer: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    model: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
       
    )

    year_of_manufacture: Mapped[int | None] = mapped_column(
        Integer
    )

    # ==================================================
    # RELATIONSHIPS
    # ==================================================

    current_station: Mapped[Optional["Station"]] = relationship(
    back_populates="trains",
    )
    schedules: Mapped[list["Schedule"]] = relationship(
        "Schedule",
        back_populates="train",
        cascade="all, delete-orphan",
    )

    trips = relationship(
        "Trip",
        back_populates="train",
        cascade="all, delete-orphan",
    )

    occupancy_records = relationship(
        "Occupancy",
        back_populates="train",
        cascade="all, delete-orphan",
    )

    delays = relationship(
        "Delay",
        back_populates="train",
        cascade="all, delete-orphan",
    )