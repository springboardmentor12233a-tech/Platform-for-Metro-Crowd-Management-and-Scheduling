from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
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


if TYPE_CHECKING:
    from .station import Station


class RidershipPrediction(Base, TimestampMixin):

    __tablename__ = "ridership_predictions"

    # =====================================================
    # Primary Key
    # =====================================================

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        nullable=False,
    )

    # =====================================================
    # Station
    # =====================================================

    station_id: Mapped[int] = mapped_column(
        ForeignKey(
            "stations.id",
            ondelete="CASCADE",
        ),
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

    predicted_entry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    predicted_exit_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # =====================================================
    # Relationship
    # =====================================================

    station = relationship(
        "Station",
        back_populates="ridership_predictions",
    )