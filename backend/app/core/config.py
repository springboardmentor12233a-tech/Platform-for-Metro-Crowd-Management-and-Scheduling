"""
Application Configuration — Pydantic Settings
===============================================
Loads all environment variables from the .env file and exposes them
as a typed singleton `settings` object used throughout the application.

Usage:
    from app.core.config import settings
    print(settings.app_name)
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    """
    Central application configuration model.

    All fields are read from environment variables (case-insensitive).
    Defaults are provided for local development; override via .env or
    actual environment variables in production.
    """

    # ------------------------------------------------------------------
    # Application Identity
    # ------------------------------------------------------------------
    app_name: str = "Metro Crowd Management API"
    app_version: str = "1.0.0"
    debug: bool = True
    environment: str = "development"

    # ------------------------------------------------------------------
    # Server Binding
    # ------------------------------------------------------------------
    host: str = "0.0.0.0"
    port: int = 8000

    # ------------------------------------------------------------------
    # JWT / Security
    # ------------------------------------------------------------------
    secret_key: str = "dev-secret-key-replace-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ------------------------------------------------------------------
    # Database (prepared for Milestone 2 — not active in Milestone 1)
    # ------------------------------------------------------------------
    database_url: str = "postgresql://user:password@localhost:5432/metro_db"

    # ------------------------------------------------------------------
    # CORS Allowed Origins
    # Accepts a comma-separated string from env vars and converts to list.
    # ------------------------------------------------------------------
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: str | List[str]) -> List[str]:
        """
        Support comma-separated string from environment variables.
        e.g. ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
        """
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    # ------------------------------------------------------------------
    # Pydantic Settings Configuration
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Silently ignore unknown env vars
    )


# ---------------------------------------------------------------------------
# Singleton — import and use this everywhere
# ---------------------------------------------------------------------------
settings = Settings()
