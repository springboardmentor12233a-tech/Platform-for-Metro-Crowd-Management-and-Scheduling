import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.api import api_router
from app.db_init import init_tables
from app.services.ml_service import ml_service

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("metroflow")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing MetroFlow backend...")
    
    # 1. Initialize tables and seed default data
    try:
        init_tables()
        logger.info("Database tables initialized and seeded successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database tables on startup: {e}")
        logger.info("Server running in offline mode. Database features may fail until connection is resolved.")
        
    # 2. Pre-load ML model
    try:
        ml_service.load_model()
    except Exception as e:
        logger.error(f"Failed to load ML model on startup: {e}")

    yield
    # Shutdown actions
    logger.info("Shutting down MetroFlow backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; refine for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact the administrator."},
    )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }
