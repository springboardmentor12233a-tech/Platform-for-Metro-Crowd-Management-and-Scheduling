import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Occupancy

from .config import CHUNK_SIZE, OCCUPANCY_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_int,
    clean_string,
    parse_datetime,
)


def load_occupancy(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {OCCUPANCY_CSV.name}...")

    try:
        if not OCCUPANCY_CSV.exists():
            logger.error(f"File not found: {OCCUPANCY_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(OCCUPANCY_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            record_id = clean_string(row.get("id"))

            if not record_id:
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
                    "id": record_id,
                    "train_id": clean_string(row.get("train_id")),
                    "station_id": station_id,
                    "timestamp": parse_datetime(row.get("timestamp")),
                    "occupancy": clean_int(row.get("occupancy")),
                    "capacity": clean_int(row.get("capacity")),
                    "occupancy_percentage": clean_float(
                        row.get("occupancy_percentage")
                    ),
                    "crowd_level": clean_string(row.get("crowd_level")),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Occupancy)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading occupancy: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats