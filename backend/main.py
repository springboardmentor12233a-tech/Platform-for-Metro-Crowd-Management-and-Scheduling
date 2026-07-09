from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from api.v1.auth import router as auth_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the MetroFlow Crowd Management & Scheduling Platform",
    version=settings.APP_VERSION,
)

# ── CORS Middleware ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────
app.include_router(auth_router)


# ── Root & Health ────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "MetroFlow API is running", "status": "online"}


@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "environment": "development"}
