"""
Application Entry Point — FastAPI App Initialization
======================================================
Bootstraps the Metro Crowd Management FastAPI application:
  - Attaches CORS middleware
  - Mounts the versioned API router
  - Defines the root landing endpoint
  - Hooks startup/shutdown lifecycle events
"""

import logging
from fastapi import FastAPI
from app.middleware.cors import setup_cors
from app.api.v1.router import api_router
from app.core.config import settings

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# FastAPI Application Instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Metro Crowd Management API",
    version="1.0.0",
    description=(
        "Real-time crowd monitoring, train scheduling, and analytics platform "
        "for metro networks. Milestone 1 — Core API scaffold with dummy data."
    ),
    contact={
        "name": "Metro Platform Engineering",
        "email": "platform@metro.gov",
    },
    license_info={
        "name": "MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# Middleware Registration
# ---------------------------------------------------------------------------
setup_cors(app)

# ---------------------------------------------------------------------------
# Router Registration
# ---------------------------------------------------------------------------
app.include_router(api_router, prefix="/api/v1")


# ---------------------------------------------------------------------------
# Lifecycle Events
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def on_startup() -> None:
    """Executed once when the server starts. Use for DB pool warm-up, etc."""
    logger.info("=" * 60)
    logger.info(f"  {settings.app_name} v{settings.app_version}")
    logger.info(f"  Environment : {settings.environment}")
    logger.info(f"  Debug Mode  : {settings.debug}")
    logger.info(f"  Docs URL    : http://{settings.host}:{settings.port}/docs")
    logger.info("=" * 60)
    logger.info("Server startup complete — ready to accept requests.")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """Executed when the server shuts down. Use to close DB connections, etc."""
    logger.info("Server shutting down gracefully.")


# ---------------------------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------------------------
@app.get(
    "/",
    tags=["Root"],
    summary="API Root",
    description="Returns a welcome message and links to documentation.",
)
async def root() -> dict:
    """Landing endpoint that confirms the API is live."""
    return {
        "message": "Metro Crowd Management API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/v1/health",
        "status": "operational",
    }
