"""
Application Configuration — Pydantic Settings
=============================================
Loads all environment variables from the .env file and exposes them
as a typed singleton `settings` object used throughout the application.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
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
    # Database
    # ------------------------------------------------------------------
    database_url: str = "postgresql+psycopg://postgres:test1234@localhost:5432/metroflow"

    # ------------------------------------------------------------------
    # CORS
    # Store as a comma-separated string in .env
    # ------------------------------------------------------------------
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]

    # ------------------------------------------------------------------
    # Pydantic Settings Configuration
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Singleton
settings = Settings()