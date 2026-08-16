from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ============================================================
    # APPLICATION
    # ============================================================

    app_name: str = "Metro Crowd Management API"

    app_version: str = "1.0.0"

    debug: bool = True

    environment: str = "development"


    # ============================================================
    # SERVER
    # ============================================================

    host: str = "0.0.0.0"

    port: int = 8000


    # ============================================================
    # DATABASE
    # ============================================================

    database_url: str


    # ============================================================
    # JWT
    # ============================================================

    jwt_secret_key: str

    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 30

    refresh_token_expire_days: int = 7


    # ============================================================
    # GOOGLE AUTHENTICATION
    # ============================================================

    google_client_id: str = ""


    # ============================================================
    # CORS
    # ============================================================

    allowed_origins: str = (
        "http://localhost:5173,http://localhost:3000"
    )


    # ============================================================
    # CORS ORIGINS PROPERTY
    # ============================================================

    @property
    def cors_origins(self) -> list[str]:

        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


    # ============================================================
    # PYDANTIC SETTINGS
    # ============================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()