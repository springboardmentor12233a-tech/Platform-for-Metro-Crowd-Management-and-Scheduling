from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from core.config import get_settings

settings = get_settings()

# ── Async Engine ─────────────────────────────────────────
# Creates a connection pool to PostgreSQL using asyncpg driver.
# echo=True logs all SQL queries in development (disable in production).
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=20,
    max_overflow=10,
)

# ── Session Factory ──────────────────────────────────────
# Each API request gets its own session (database transaction).
# expire_on_commit=False keeps loaded objects accessible after commit.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ── Base Model ───────────────────────────────────────────
# All SQLAlchemy models will inherit from this.
class Base(DeclarativeBase):
    pass


# ── Dependency ───────────────────────────────────────────
# Used with FastAPI's Depends() to inject a DB session into endpoints.
# The session is automatically closed when the request finishes.
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
