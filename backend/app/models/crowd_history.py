from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
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


if TYPE_CHECKING:
    from .station import Station


class CrowdHistory(Base, TimestampMixin):
    __tablename__ = "crowd_history"

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
    # Crowd Statistics
    # =====================================================

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    entry_count: Mapped[int | None] = mapped_column(
        Integer
    )

    exit_count: Mapped[int | None] = mapped_column(
        Integer
    )

    platform_count: Mapped[int | None] = mapped_column(
        Integer
    )

    concourse_count: Mapped[int | None] = mapped_column(
        Integer
    )

    crowd_density: Mapped[float | None] = mapped_column(
        Float
    )

    # =====================================================
    # Relationship
    # =====================================================

    station = relationship(
        "Station",
        back_populates="crowd_history",
    )