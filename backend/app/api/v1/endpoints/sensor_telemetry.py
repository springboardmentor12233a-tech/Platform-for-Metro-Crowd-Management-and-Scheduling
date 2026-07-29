from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.sensor_telemetry import (
    SensorTelemetryCreate,
    SensorTelemetryUpdate,
    SensorTelemetryResponse,
)
from app.services.sensor_telemetry import (
    SensorTelemetryService,
)

router = APIRouter()


@router.post(
    "/",
    response_model=SensorTelemetryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sensor_record(
    sensor: SensorTelemetryCreate,
    db: Session = Depends(get_db),
):
    return SensorTelemetryService.create_sensor_record(
        db=db,
        sensor=sensor,
    )


@router.get(
    "/",
    response_model=List[SensorTelemetryResponse],
)
def get_all_sensor_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    return SensorTelemetryService.get_all_sensor_records(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{sensor_id}",
    response_model=SensorTelemetryResponse,
)
def get_sensor_record(
    sensor_id: str,
    db: Session = Depends(get_db),
):
    sensor = SensorTelemetryService.get_sensor_record(
        db=db,
        sensor_id=sensor_id,
    )

    if sensor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor telemetry record not found",
        )

    return sensor


@router.put(
    "/{sensor_id}",
    response_model=SensorTelemetryResponse,
)
def update_sensor_record(
    sensor_id: str,
    sensor: SensorTelemetryUpdate,
    db: Session = Depends(get_db),
):
    updated = SensorTelemetryService.update_sensor_record(
        db=db,
        sensor_id=sensor_id,
        sensor=sensor,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor telemetry record not found",
        )

    return updated


@router.delete(
    "/{sensor_id}",
    response_model=SensorTelemetryResponse,
)
def delete_sensor_record(
    sensor_id: str,
    db: Session = Depends(get_db),
):
    deleted = SensorTelemetryService.delete_sensor_record(
        db=db,
        sensor_id=sensor_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor telemetry record not found",
        )

    return deleted