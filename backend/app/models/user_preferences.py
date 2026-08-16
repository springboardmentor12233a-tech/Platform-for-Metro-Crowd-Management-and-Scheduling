from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class UserPreferences(Base, TimestampMixin):

    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    # ========================================================
    # Notifications
    # ========================================================

    email_alerts: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    push_notifications: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    crowd_threshold_alerts: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    train_delay_notifications: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    system_updates: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    weekly_report: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # ========================================================
    # System
    # ========================================================

    refresh_interval: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=30,
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Asia/Kolkata",
    )

    language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en",
    )

    theme: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="dark",
    )

    crowd_threshold: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=80,
    )