from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class User(Base, TimestampMixin):

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(100),
        primary_key=True,
    )

    username: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True,
    )

    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # admin / user

    role: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="user",
    )

    # local admin authentication

    hashed_password: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Google authentication

    google_sub: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    auth_provider: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="google",
    )