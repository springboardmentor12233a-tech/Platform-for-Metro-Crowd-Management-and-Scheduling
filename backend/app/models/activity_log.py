from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    user_name = Column(
        String(100),
        nullable=False,
    )

    role = Column(
        String(30),
        nullable=False,
    )

    action = Column(
        String(100),
        nullable=False,
    )

    module = Column(
        String(100),
        nullable=False,
    )

    target = Column(
        String(255),
        nullable=True,
    )

    status = Column(
        String(20),
        default="Success",
    )

    ip_address = Column(
        String(50),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship("User")