from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from .base import Base, TimestampMixin


class DelayPrediction(Base, TimestampMixin):

    __tablename__ = "delay_predictions"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        nullable=False,
    )

    route_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    transport_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    prediction_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    scheduled_departure_min: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    scheduled_arrival_min: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    predicted_delay_minutes: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    delay_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )