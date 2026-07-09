import os
from typing import List


def _clean_origin(value: str) -> str:
    return value.strip().rstrip("/")


class Settings:
    PROJECT_NAME: str = "MetroFlow"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./metroflow.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "metroflow-milestone1-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    MAX_IMPORT_ROWS: int = int(os.getenv("MAX_IMPORT_ROWS", "30000"))
    DATASET_PATH: str = os.getenv("DATASET_PATH", "app/../data/delhi_metro_updated.csv")

    @property
    def CORS_ORIGINS(self) -> List[str]:
        value = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        return [_clean_origin(origin) for origin in value.split(",") if origin.strip()]


settings = Settings()
