import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Schedule

from .config import CHUNK_SIZE, SCHEDULES_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_int,
    clean_string,
    parse_time,
)


def load_schedules(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {SCHEDULES_CSV.name}...")

    try:
        if not SCHEDULES_CSV.exists():
            logger.error(f"File not found: {SCHEDULES_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(SCHEDULES_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            schedule_id = clean_string(row.get("id"))

            if not schedule_id:
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

            station_name = clean_string(row.get("station_name"))

            if not station_name:
                stats["skipped"] += 1
                continue

            station_id = mapper.get_or_create_station(station_name)

            if not station_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": schedule_id,
                    "train_id": train_id,
                    "station_id": station_id,
                    "arrival_time": parse_time(row.get("arrival_time")),
                    "departure_time": parse_time(row.get("departure_time")),
                    "stop_sequence": clean_int(
                        row.get("stop_sequence")
                    ),
                    "day_type": clean_string(
                        row.get("day_type")
                    ),
                    "platform": clean_string(
                        row.get("platform")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Schedule)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading schedules: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats