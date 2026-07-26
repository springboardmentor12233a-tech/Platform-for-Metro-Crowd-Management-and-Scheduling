import logging
import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.api import api_router
from app.db_init import init_tables
from app.services.ml_service import ml_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("metroflow")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing MetroFlow backend...")

    try:
        init_tables()
        logger.info("Database tables initialized and seeded successfully.")
    except Exception:
        logger.exception("Failed to initialize database tables on startup")
        traceback.print_exc()

    try:
        ml_service.load_model()
    except Exception:
        logger.exception("Failed to load ML model on startup")

    yield

    logger.info("Shutting down MetroFlow backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please contact the administrator."
        },
    )


@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs",
    }