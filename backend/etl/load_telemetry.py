import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import SensorTelemetry

from .config import CHUNK_SIZE, SENSOR_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_int,
    clean_string,
    parse_datetime,
)


def normalize_device_status(value):
    """
    Convert dataset device-status values to the values
    supported by the DeviceStatus enum.

    Dataset:
        Active
        Faulty
        Maintenance
        Offline

    Database enum:
        Working
        Faulty
        Maintenance
        Offline
    """

    value = clean_string(value)

    if not value:
        return None

    mapping = {
    "Active": "Working",
    "Working": "Working",
    "Inactive": "Offline",
    "Offline": "Offline",
    "Under Maintenance": "Maintenance",
    "Maintenance": "Maintenance",
    "Faulty": "Faulty",
}

    return mapping.get(value)


def load_telemetry(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {SENSOR_CSV.name}...")

    try:
        # -----------------------------------
        # Check CSV
        # -----------------------------------

        if not SENSOR_CSV.exists():
            logger.error(f"File not found: {SENSOR_CSV}")
            stats["errors"] += 1
            return stats

        # -----------------------------------
        # Read CSV
        # -----------------------------------

        df = pd.read_csv(SENSOR_CSV)

        stats["loaded"] = len(df)

        logger.info(
            f"Sensor telemetry records found: {stats['loaded']}"
        )

        valid_dicts = []

        # -----------------------------------
        # Process Records
        # -----------------------------------

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            telemetry_id = clean_string(row.get("id"))

            if not telemetry_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Station Mapping
            # -----------------------------------

            station_name = clean_string(
                row.get("station_name")
            )

            if not station_name:
                stats["skipped"] += 1
                continue

            station_id = mapper.get_or_create_station(
                station_name
            )

            # -----------------------------------
            # Device Status
            # -----------------------------------

            escalator_status = normalize_device_status(
                row.get("escalator_status")
            )

            lift_status = normalize_device_status(
                row.get("lift_status")
            )

            camera_status = normalize_device_status(
                row.get("camera_status")
            )

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": telemetry_id,
                    "station_id": station_id,

                    "timestamp": parse_datetime(
                        row.get("timestamp")
                    ),

                    "temperature": clean_float(
                        row.get("temperature")
                    ),

                    "humidity": clean_float(
                        row.get("humidity")
                    ),

                    "co2_ppm": clean_float(
                        row.get("co2_ppm")
                    ),

                    "pm25": clean_float(
                        row.get("pm25")
                    ),

                    "platform_crowd": clean_int(
                        row.get("platform_crowd")
                    ),

                    "escalator_status": escalator_status,

                    "lift_status": lift_status,

                    "camera_status": camera_status,
                }
            )

        logger.info(
            f"Prepared {len(valid_dicts)} new sensor telemetry records"
        )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(
                valid_dicts,
                CHUNK_SIZE,
            ):

                stmt = (
                    insert(SensorTelemetry)
                    .values(chunk)
                    .on_conflict_do_nothing(
                        index_elements=[SensorTelemetry.id]
                    )
                    .returning(SensorTelemetry.id)
                )

                result = db.execute(stmt)

                inserted_ids = result.fetchall()

                batch_inserted = len(inserted_ids)
                batch_skipped = len(chunk) - batch_inserted

                stats["inserted"] += batch_inserted
                stats["skipped"] += batch_skipped

                logger.info(
                    f"Inserted sensor telemetry batch: "
                    f"{batch_inserted}/{len(chunk)}"
                )

            db.commit()

            logger.info(
                "Sensor telemetry data committed successfully"
            )

        # -----------------------------------
        # Completion Summary
        # -----------------------------------

        logger.info("========================================")
        logger.info("Sensor telemetry loading completed")
        logger.info(f"Total records: {stats['loaded']}")
        logger.info(f"Inserted: {stats['inserted']}")
        logger.info(f"Skipped: {stats['skipped']}")
        logger.info(f"Errors: {stats['errors']}")
        logger.info("========================================")

    except Exception as e:
        logger.error(
            f"Error loading sensor telemetry: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(
        time.time() - t0,
        2,
    )

    return stats