from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
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


class SchedulePrediction(Base, TimestampMixin):
    __tablename__ = "schedule_predictions"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        nullable=False,
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
    # Core Prediction Info
    # =====================================================

    prediction_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    train_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    # =====================================================
    # Schedule Actions
    # =====================================================

    schedule_action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    action_code: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    reschedule_required: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # =====================================================
    # Timings & Platforms
    # =====================================================

    current_departure_time: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    recommended_departure_time: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    current_platform: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    recommended_platform: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # =====================================================
    # Context (Crowd, Frequency, Delay)
    # =====================================================

    predicted_passengers: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    crowd_level: Mapped[CrowdLevel | None] = mapped_column(
        Enum(CrowdLevel, name="crowd_level", create_type=False), # <-- Added create_type=False
        nullable=True,
    )
    current_frequency: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    recommended_frequency: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    delay_minutes: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    train_to_allocate: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # =====================================================
    # Explanations
    # =====================================================

    recommendation: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =====================================================
    # Relationship
    # =====================================================

    station = relationship(
        "Station",
        back_populates="schedule_predictions",
    )