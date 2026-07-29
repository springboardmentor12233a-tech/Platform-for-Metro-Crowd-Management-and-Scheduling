from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    crowd,
    scheduling,
    analytics,
    alerts,
    health,
)
from app.api.v1.endpoints import train
from app.api.v1.endpoints.station import router as station_router
from app.api.v1.endpoints.crowd_history import router as crowd_history_router
from app.api.v1.endpoints.crowd_prediction import (
    router as crowd_prediction_router,
)
from app.api.v1.endpoints import crowd_prediction

from app.api.v1.endpoints.schedule import (
    router as schedule_router,
)
from app.api.v1.endpoints.occupancy import (
    router as occupancy_router,
)
from app.api.v1.endpoints.sensor_telemetry import (
    router as sensor_telemetry_router,
)
from app.api.v1.endpoints.delay import (
    router as delay_router,
)
from app.api.v1.endpoints.passenger_journey import (
    router as passenger_journey_router,
)
from app.api.v1.endpoints.ticket import (
    router as ticket_router,
)
from app.api.v1.endpoints.trip import (
    router as trip_router,
)
from app.api.v1.endpoints.ridership_prediction import (
    router as ridership_prediction_router,
)
# ---------------------------------------------------------------------------
# Root v1 Router
# This router is mounted at /api/v1 in app/main.py
# ---------------------------------------------------------------------------
api_router = APIRouter()
api_router.include_router(
    station_router,
    prefix="/stations",
    tags=["Stations"],
)

# Health probes — no auth required
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

api_router.include_router(
    crowd_history_router,
    prefix="/crowd-history",
    tags=["Crowd History"],
)

api_router.include_router(
    crowd_prediction_router,
    prefix="/crowd-predictions",
    tags=["Crowd Predictions"],
)
api_router.include_router(
    schedule_router,
    prefix="/schedules",
    tags=["Schedules"],
)
api_router.include_router(
    occupancy_router,
    prefix="/occupancy",
    tags=["Occupancy"],
)
api_router.include_router(
    sensor_telemetry_router,
    prefix="/sensor-telemetry",
    tags=["Sensor Telemetry"],

)
api_router.include_router(
    delay_router,
    prefix="/delays",
    tags=["Delays"],
)
api_router.include_router(
    passenger_journey_router,
    prefix="/passenger-journeys",
    tags=["Passenger Journeys"],
)
api_router.include_router(
    ticket_router,
    prefix="/tickets",
    tags=["Tickets"],
)
api_router.include_router(
    trip_router,
    prefix="/trips",
    tags=["Trips"],
)
api_router.include_router(
    crowd_prediction.router,
    prefix="/crowd-predictions",
    tags=["Crowd Prediction"],
)
# Authentication — login / logout / profile
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    ridership_prediction_router,
    prefix="/ridership-predictions",
    tags=["Ridership Prediction"],
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
    train.router,
    prefix="/trains",
    tags=["Train Status"],
)
