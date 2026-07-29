import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import CrowdPrediction

from .config import CHUNK_SIZE, CROWD_PREDICTION_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_int,
    clean_string,
    parse_datetime,
)


def load_crowd_prediction(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {CROWD_PREDICTION_CSV.name}...")

    try:
        if not CROWD_PREDICTION_CSV.exists():
            logger.error(f"File not found: {CROWD_PREDICTION_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(CROWD_PREDICTION_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            prediction_id = clean_string(row.get("id"))

            if not prediction_id:
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
                    "id": prediction_id,
                    "station_id": station_id,
                    "prediction_time": parse_datetime(
                        row.get("prediction_time")
                    ),
                    "predicted_entries": clean_int(
                        row.get("predicted_entries")
                    ),
                    "predicted_exits": clean_int(
                        row.get("predicted_exits")
                    ),
                    "predicted_platform_crowd": clean_int(
                        row.get("predicted_platform_crowd")
                    ),
                    "predicted_crowd_level": clean_string(
                        row.get("predicted_crowd_level")
                    ),
                    "confidence_score": clean_float(
                        row.get("confidence_score")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(CrowdPrediction)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading crowd prediction: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats