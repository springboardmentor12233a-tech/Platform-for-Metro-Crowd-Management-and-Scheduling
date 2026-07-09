from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    All sensitive values (SECRET_KEY, DATABASE_URL) should be set via .env
    and NEVER hardcoded in source code.
    """

    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "MetroFlow API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ── Database ─────────────────────────────────────────
    # Format: postgresql+asyncpg://user:password@host:port/dbname
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/metroflow"

    # ── JWT Auth ─────────────────────────────────────────
    SECRET_KEY: str = "CHANGE-THIS-TO-A-RANDOM-SECRET-IN-PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── CORS ─────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    Using lru_cache ensures we only read .env once.
    """
    return Settings()
