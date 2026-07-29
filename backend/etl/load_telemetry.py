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
        if not SENSOR_CSV.exists():
            logger.error(f"File not found: {SENSOR_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(SENSOR_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

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

            station_name = clean_string(row.get("station_name"))

            if not station_name:
                stats["skipped"] += 1
                continue

            station_id = mapper.get_or_create_station(station_name)

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": telemetry_id,
                    "station_id": station_id,
                    "timestamp": parse_datetime(row.get("timestamp")),
                    "temperature": clean_float(row.get("temperature")),
                    "humidity": clean_float(row.get("humidity")),
                    "co2_ppm": clean_float(row.get("co2_ppm")),
                    "pm25": clean_float(row.get("pm25")),
                    "platform_crowd": clean_int(row.get("platform_crowd")),
                    "escalator_status": clean_string(
                        row.get("escalator_status")
                    ),
                    "lift_status": clean_string(
                        row.get("lift_status")
                    ),
                    "camera_status": clean_string(
                        row.get("camera_status")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(SensorTelemetry)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading telemetry: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats