from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Train(Base):
    __tablename__ = "trains"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    train_number = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
    )

    train_name = Column(
        String(150),
        nullable=False,
    )

    line = Column(
        String(50),
        nullable=False,
    )

    train_type = Column(
        String(50),
        nullable=False,
        default="Standard",
    )

    capacity = Column(
        Integer,
        nullable=False,
    )

    coaches = Column(
        Integer,
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="Active",
    )