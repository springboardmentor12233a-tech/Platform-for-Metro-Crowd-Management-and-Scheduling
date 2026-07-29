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
from .enums import DeviceStatus


if TYPE_CHECKING:
    from .station import Station


class SensorTelemetry(Base, TimestampMixin):
    __tablename__ = "sensor_telemetry"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
    )

    # =====================================================
    # Foreign Key
    # =====================================================

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # Sensor Reading
    # =====================================================

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    temperature: Mapped[float | None] = mapped_column(
        Float
    )

    humidity: Mapped[float | None] = mapped_column(
        Float
    )

    co2_ppm: Mapped[float | None] = mapped_column(
        Float
    )

    pm25: Mapped[float | None] = mapped_column(
        Float
    )

    platform_crowd: Mapped[int | None] = mapped_column(
        Integer
    )

    # =====================================================
    # Device Status
    # =====================================================

    escalator_status: Mapped[DeviceStatus | None] = mapped_column(
        Enum(DeviceStatus, name="device_status"),
        nullable=True,
    )

    lift_status: Mapped[DeviceStatus | None] = mapped_column(
        Enum(DeviceStatus, name="device_status"),
        nullable=True,
    )

    camera_status: Mapped[DeviceStatus | None] = mapped_column(
        Enum(DeviceStatus, name="device_status"),
        nullable=True,
    )

    # =====================================================
    # Relationship
    # =====================================================

    station = relationship(
        "Station",
        back_populates="sensor_records",
    )