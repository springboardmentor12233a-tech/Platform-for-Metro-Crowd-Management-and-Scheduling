import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import init_db
from backend.routers import auth_router, stations_router, trains_router, schedules_router, predictions_router, reports_router, live_ws_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("metroflow.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("[+] Starting AI MetroFlow Backend Service...")
    await init_db()

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "docs": "/docs",
        "ws_telemetry": "/api/crowd/ws"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "active"}

# Mount Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(stations_router.router, prefix=settings.API_V1_STR)
app.include_router(trains_router.router, prefix=settings.API_V1_STR)
app.include_router(schedules_router.router, prefix=settings.API_V1_STR)
app.include_router(predictions_router.router) # direct aliases included in router
app.include_router(reports_router.router)     # direct aliases included in router
app.include_router(live_ws_router.router)
