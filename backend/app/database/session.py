"""
Database Session Configuration
================================
This module is PREPARED for future milestones.
Database integration is NOT active in Milestone 1.
All database calls are currently stubbed with dummy data in the endpoint layer.

When activating in Milestone 2:
  1. Uncomment the imports and engine/session lines below.
  2. Set DATABASE_URL in your .env file.
  3. Replace `pass` in `get_db()` with the real session context manager.
  4. Run `alembic upgrade head` to apply migrations.
"""

# Standard library
from typing import Generator

# SQLAlchemy core
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

# Application config — uncomment when DB is active
# from app.core.config import settings

# ---------------------------------------------------------------------------
# ORM Base Class
# All SQLAlchemy models must inherit from this Base so Alembic can detect them.
# ---------------------------------------------------------------------------
Base = declarative_base()

# ---------------------------------------------------------------------------
# Engine and SessionLocal — DISABLED in Milestone 1
# ---------------------------------------------------------------------------
# ENGINE = create_engine(
#     settings.database_url,
#     pool_pre_ping=True,       # Reconnect on stale connections
#     pool_size=10,             # Connection pool size
#     max_overflow=20,          # Extra connections beyond pool_size
#     echo=settings.debug,      # Log all SQL statements in debug mode
# )

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=ENGINE,
# )


# ---------------------------------------------------------------------------
# FastAPI Dependency — Database Session Injection
# ---------------------------------------------------------------------------
def get_db() -> Generator[None, None, None]:
    """
    FastAPI dependency that provides a SQLAlchemy database session.

    Usage in a route:
        @router.get('/items')
        def list_items(db: Session = Depends(get_db)):
            ...

    NOTE: This is a placeholder for Milestone 1.
          Replace the body with the real implementation below when DB is active.

    Real implementation (Milestone 2+):
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    """
    # TODO: Replace with real session in Milestone 2
    pass
