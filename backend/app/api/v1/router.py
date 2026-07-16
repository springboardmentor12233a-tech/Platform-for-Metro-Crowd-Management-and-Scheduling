"""
API v1 Main Router
===================
Aggregates all endpoint sub-routers under the /api/v1 prefix.

Router tags appear as groups in the Swagger UI (/docs).
Add new routers here as new feature modules are developed.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    crowd,
    scheduling,
    analytics,
    alerts,
    trains,
    health,
)

# ---------------------------------------------------------------------------
# Root v1 Router
# This router is mounted at /api/v1 in app/main.py
# ---------------------------------------------------------------------------
api_router = APIRouter()

# Health probes — no auth required
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

# Authentication — login / logout / profile
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

# Crowd Monitoring — per-station density readings
api_router.include_router(
    crowd.router,
    prefix="/crowd",
    tags=["Crowd Monitoring"],
)

# Train Scheduling — schedule list and detail
api_router.include_router(
    scheduling.router,
    prefix="/schedules",
    tags=["Scheduling"],
)

# Analytics — aggregated performance reports
api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"],
)

# Alerts — system alert management
api_router.include_router(
    alerts.router,
    prefix="/alerts",
    tags=["Alerts"],
)

# Train Status — real-time train tracking
api_router.include_router(
    trains.router,
    prefix="/trains",
    tags=["Train Status"],
)
