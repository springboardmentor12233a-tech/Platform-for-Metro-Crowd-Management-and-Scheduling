"""
Health Check Endpoints
=======================
Provides liveness and readiness probes for infrastructure monitoring tools
(Kubernetes, AWS ALB, Docker health checks, uptime monitoring services).

Routes:
    GET /api/v1/health        — Liveness: confirms the process is running.
    GET /api/v1/health/ready  — Readiness: confirms dependencies are available.
"""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


# ---------------------------------------------------------------------------
# Liveness Probe
# ---------------------------------------------------------------------------
@router.get(
    "/",
    summary="Liveness Health Check",
    description=(
        "Returns HTTP 200 if the application process is alive. "
        "Used by load balancers to decide if traffic should be routed here."
    ),
    response_description="Service health status",
)
async def health_check() -> dict:
    """
    Liveness probe — confirms the API process is running.

    Returns application name, version, environment, and current UTC timestamp.
    """
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Readiness Probe
# ---------------------------------------------------------------------------
@router.get(
    "/ready",
    summary="Readiness Check",
    description=(
        "Returns HTTP 200 if the service is fully initialized and ready to serve traffic. "
        "In future milestones this will validate database connectivity."
    ),
    response_description="Readiness status with dependency checks",
)
async def readiness_check() -> dict:
    """
    Readiness probe — confirms all dependencies are reachable.

    Milestone 1: Database is not configured — returns 'not_configured'.
    Milestone 2+: This endpoint will attempt a real DB ping and return
                  'connected' or 'unreachable' accordingly.
    """
    return {
        "status": "ready",
        "service": settings.app_name,
        "checks": {
            # TODO (Milestone 2): Replace with actual DB ping
            "database": "not_configured",
            # TODO (Milestone 3): Replace with real Redis ping
            "cache": "not_configured",
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Version Info
# ---------------------------------------------------------------------------
@router.get(
    "/version",
    summary="Version Info",
    description="Returns the current API version and environment details.",
)
async def version_info() -> dict:
    """Returns version metadata for API consumers."""
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "debug": settings.debug,
    }
