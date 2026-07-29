import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Ticket

from .config import CHUNK_SIZE, TICKETING_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_float,
    clean_string,
    parse_date,
    parse_datetime,
)


def load_tickets(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {TICKETING_CSV.name}...")

    try:
        if not TICKETING_CSV.exists():
            logger.error(f"File not found: {TICKETING_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(TICKETING_CSV)
        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            ticket_id = clean_string(row.get("id"))

            if not ticket_id:
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
                    "id": ticket_id,
                    "origin_station_id": origin_station_id,
                    "destination_station_id": destination_station_id,
                    "fare": clean_float(row.get("fare")),
                    "ticket_type": clean_string(row.get("ticket_type")),
                    "payment_method": clean_string(row.get("payment_method")),
                    "purchase_time": parse_datetime(
                        row.get("purchase_time")
                    ),
                    "travel_date": parse_date(
                        row.get("travel_date")
                    ),
                    "passenger_category": clean_string(
                        row.get("passenger_category")
                    ),
                }
            )

        # -----------------------------------
        # Bulk Insert
        # -----------------------------------

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Ticket)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading tickets: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats