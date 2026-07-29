import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import CrowdHistory

from .config import CHUNK_SIZE, CROWD_HISTORY_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_int,
    clean_string,
    parse_datetime,
)


def load_crowd_history(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {CROWD_HISTORY_CSV.name}...")

    try:
        if not CROWD_HISTORY_CSV.exists():
            logger.error(f"File not found: {CROWD_HISTORY_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(CROWD_HISTORY_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -------------------------------
            # Primary Key
            # -------------------------------

            record_id = clean_string(row.get("id"))

            if not record_id:
                stats["skipped"] += 1
                continue

            # -------------------------------
            # Station Mapping
            # -------------------------------

            station_name = clean_string(row.get("station_name"))

            if not station_name:
                stats["skipped"] += 1
                continue

            station_id = mapper.get_or_create_station(station_name)

            # -------------------------------
            # Build Record
            # -------------------------------

            valid_dicts.append(
                {
                    "id": record_id,
                    "station_id": station_id,
                    "timestamp": parse_datetime(row.get("timestamp")),
                    "entry_count": clean_int(row.get("entry_count")),
                    "exit_count": clean_int(row.get("exit_count")),
                    "platform_count": clean_int(row.get("platform_count")),
                    "concourse_count": clean_int(row.get("concourse_count")),
                    "crowd_density": clean_float(row.get("crowd_density")),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):
                stmt = (
                    insert(CrowdHistory)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading crowd history: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats