from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class FrequencyAdjustment(Base):

    __tablename__ = "frequency_adjustments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False,
        index=True,
    )

    occupancy: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    occupancy_percentage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    current_frequency: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    recommended_frequency: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    frequency_action: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    action_code: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    additional_trains_required: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    action_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    recommendation: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    estimated_wait_time_impact: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )