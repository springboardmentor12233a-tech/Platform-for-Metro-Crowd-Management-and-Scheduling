from sqlalchemy.orm import Session

from app.models.sensor_telemetry import SensorTelemetry
from app.repositories.sensor_telemetry import (
    sensor_telemetry_repository,
)
from app.schemas.sensor_telemetry import (
    SensorTelemetryCreate,
    SensorTelemetryUpdate,
)


class SensorTelemetryService:

    @staticmethod
    def create_sensor_record(
        db: Session,
        sensor: SensorTelemetryCreate,
    ) -> SensorTelemetry:
        return sensor_telemetry_repository.create(
            db=db,
            obj_in=sensor,
        )

    @staticmethod
    def get_sensor_record(
        db: Session,
        sensor_id: str,
    ):
        return sensor_telemetry_repository.get(
            db=db,
            id=sensor_id,
        )

    @staticmethod
    def get_all_sensor_records(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ):
        return sensor_telemetry_repository.get_multi(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def update_sensor_record(
        db: Session,
        sensor_id: str,
        sensor: SensorTelemetryUpdate,
    ):
        db_obj = sensor_telemetry_repository.get(
            db=db,
            id=sensor_id,
        )

        if db_obj is None:
            return None

        return sensor_telemetry_repository.update(
            db=db,
            db_obj=db_obj,
            obj_in=sensor,
        )

    @staticmethod
    def delete_sensor_record(
        db: Session,
        sensor_id: str,
    ):
        return sensor_telemetry_repository.remove(
            db=db,
            id=sensor_id,
        )