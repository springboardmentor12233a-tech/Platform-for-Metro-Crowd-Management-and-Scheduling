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


class CrowdPrediction(Base, TimestampMixin):
    __tablename__ = "crowd_predictions"

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
    # Prediction Information
    # =====================================================

    prediction_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    predicted_entries: Mapped[int | None] = mapped_column(
        Integer
    )

    predicted_exits: Mapped[int | None] = mapped_column(
        Integer
    )

    predicted_platform_crowd: Mapped[int | None] = mapped_column(
        Integer
    )

    predicted_crowd_level: Mapped[CrowdLevel | None] = mapped_column(
        Enum(CrowdLevel, name="crowd_level"),
        nullable=True,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Float
    )

    # =====================================================
    # Relationship
    # =====================================================

    station = relationship(
        "Station",
        back_populates="crowd_predictions",
    )