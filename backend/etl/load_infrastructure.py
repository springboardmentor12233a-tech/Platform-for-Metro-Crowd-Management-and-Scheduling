import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Train

from .config import CHUNK_SIZE, TRAINS_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import clean_float, clean_int, clean_string


def load_infrastructure(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {TRAINS_CSV.name}...")

    try:
        if not TRAINS_CSV.exists():
            logger.error(f"File not found: {TRAINS_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(TRAINS_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            train_id = clean_string(row.get("id"))

            if not train_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Station Mapping
            # -----------------------------------

            station_name = clean_string(row.get("current_station"))

            station_id = None

            if station_name:
                station_id = mapper.get_or_create_station(station_name)

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": train_id,
                    "train_number": clean_string(row.get("train_number")),
                    "train_name": clean_string(row.get("train_name")),
                    "line": clean_string(row.get("line")),
                    "capacity": clean_int(row.get("capacity")),
                    "current_station_id": station_id,
                    "status": clean_string(row.get("status")),
                    "speed_limit_kmh": clean_float(row.get("speed_limit_kmh")),
                    "manufacturer": clean_string(row.get("manufacturer")),
                    "model": clean_string(row.get("model")),
                    "year_of_manufacture": clean_int(
                        row.get("year_of_manufacture")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Train)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading trains: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats