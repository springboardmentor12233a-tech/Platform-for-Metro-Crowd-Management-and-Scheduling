import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Trip

from .config import CHUNK_SIZE, TRIPS_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_string,
    parse_date,
    parse_datetime,
)


def load_trips(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {TRIPS_CSV.name}...")

    try:
        if not TRIPS_CSV.exists():
            logger.error(f"File not found: {TRIPS_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(TRIPS_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            trip_id = clean_string(row.get("id"))

            if not trip_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Train
            # -----------------------------------

            train_id = clean_string(row.get("train_id"))

            if not train_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Station Mapping
            # -----------------------------------

            origin_station = clean_string(row.get("origin_station"))
            destination_station = clean_string(row.get("destination_station"))

            if not origin_station or not destination_station:
                stats["skipped"] += 1
                continue

            origin_station_id = mapper.get_or_create_station(origin_station)
            destination_station_id = mapper.get_or_create_station(destination_station)

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": trip_id,
                    "train_id": train_id,
                    "origin_station_id": origin_station_id,
                    "destination_station_id": destination_station_id,
                    "departure_time": parse_datetime(
                        row.get("departure_time")
                    ),
                    "arrival_time": parse_datetime(
                        row.get("arrival_time")
                    ),
                    "trip_date": parse_date(
                        row.get("trip_date")
                    ),
                    "trip_duration_min": clean_float(
                        row.get("trip_duration_min")
                    ),
                    "distance_km": clean_float(
                        row.get("distance_km")
                    ),
                    "average_speed_kmh": clean_float(
                        row.get("average_speed_kmh")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Trip)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading trips: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats