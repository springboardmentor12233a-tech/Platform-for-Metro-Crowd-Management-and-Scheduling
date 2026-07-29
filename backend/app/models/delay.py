from __future__ import annotations

from datetime import date, time
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Time,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from .base import Base, TimestampMixin
from .enums import (
    Season,
    TransportType,
    WeatherCondition,
    Weekday,
)


if TYPE_CHECKING:
    from .station import Station
    from .train import Train


class Delay(Base, TimestampMixin):
    __tablename__ = "delays"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
    )

    # =====================================================
    # Foreign Keys
    # =====================================================

    train_id: Mapped[str | None] = mapped_column(
        ForeignKey("trains.id", ondelete="SET NULL"),
        index=True,
    )

    origin_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    destination_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # =====================================================
    # Schedule Information
    # =====================================================

    date: Mapped[date | None] = mapped_column(Date)

    time: Mapped[time | None] = mapped_column(Time)

    transport_type: Mapped[TransportType | None] = mapped_column(
        Enum(TransportType, name="transport_type"),
        nullable=True,
    )

    scheduled_departure: Mapped[time | None] = mapped_column(Time)

    scheduled_arrival: Mapped[time | None] = mapped_column(Time)

    actual_departure_delay_min: Mapped[float | None] = mapped_column(Float)

    actual_arrival_delay_min: Mapped[float | None] = mapped_column(Float)

    # =====================================================
    # Weather
    # =====================================================

    weather_condition: Mapped[WeatherCondition | None] = mapped_column(
        Enum(WeatherCondition, name="weather_condition"),
        nullable=True,
    )

    temperature_c: Mapped[float | None] = mapped_column(Float)

    humidity_percent: Mapped[float | None] = mapped_column(Float)

    wind_speed_kmh: Mapped[float | None] = mapped_column(Float)

    precipitation_mm: Mapped[float | None] = mapped_column(Float)

    # =====================================================
    # External Factors
    # =====================================================

    event_type: Mapped[str | None] = mapped_column(
        String(100)
    )

    event_attendance_est: Mapped[int | None] = mapped_column(Integer)

    traffic_congestion_index: Mapped[float | None] = mapped_column(Float)

    holiday: Mapped[bool | None] = mapped_column(Boolean)

    peak_hour: Mapped[bool | None] = mapped_column(Boolean)

    weekday: Mapped[Weekday | None] = mapped_column(
        Enum(Weekday, name="weekday"),
        nullable=True,
    )

    season: Mapped[Season | None] = mapped_column(
        Enum(Season, name="season"),
        nullable=True,
    )

    delayed: Mapped[bool | None] = mapped_column(Boolean)

    # =====================================================
    # Engineered Features
    # =====================================================

    time_min: Mapped[int | None] = mapped_column(Integer)

    scheduled_departure_min: Mapped[int | None] = mapped_column(Integer)

    scheduled_arrival_min: Mapped[int | None] = mapped_column(Integer)

    is_delayed_5min: Mapped[bool | None] = mapped_column(Boolean)

    year: Mapped[int | None] = mapped_column(Integer)

    month: Mapped[int | None] = mapped_column(Integer)

    day_of_week: Mapped[str | None] = mapped_column(
        String(20)
    )

    is_weekend: Mapped[bool | None] = mapped_column(Boolean)

    # =====================================================
    # Outlier Flags
    # =====================================================

    actual_departure_delay_min_outlier: Mapped[bool | None] = mapped_column(Boolean)

    actual_arrival_delay_min_outlier: Mapped[bool | None] = mapped_column(Boolean)

    event_attendance_est_outlier: Mapped[bool | None] = mapped_column(Boolean)

    traffic_congestion_index_outlier: Mapped[bool | None] = mapped_column(Boolean)

    # =====================================================
    # Relationships
    # =====================================================

    train = relationship(
        "Train",
        back_populates="delays",
    )

    origin_station = relationship(
        "Station",
        foreign_keys=[origin_station_id],
        back_populates="delay_origins",
    )

    destination_station = relationship(
        "Station",
        foreign_keys=[destination_station_id],
        back_populates="delay_destinations",
    )