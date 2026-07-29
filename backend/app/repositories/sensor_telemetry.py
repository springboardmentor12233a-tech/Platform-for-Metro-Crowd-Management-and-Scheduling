from app.models.sensor_telemetry import SensorTelemetry
from app.repositories.base import CRUDBase
from app.schemas.sensor_telemetry import (
    SensorTelemetryCreate,
    SensorTelemetryUpdate,
)


class SensorTelemetryRepository(
    CRUDBase[
        SensorTelemetry,
        SensorTelemetryCreate,
        SensorTelemetryUpdate,
    ]
):
    """Repository for Sensor Telemetry CRUD operations."""

    pass


sensor_telemetry_repository = SensorTelemetryRepository(
    SensorTelemetry
)