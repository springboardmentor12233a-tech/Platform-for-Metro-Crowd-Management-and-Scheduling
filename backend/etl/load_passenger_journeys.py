import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import PassengerJourney

from .config import CHUNK_SIZE, PASSENGER_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_int,
    clean_string,
    parse_datetime,
)


def load_passenger_journeys(db: Session, mapper: Mapper) -> dict:
    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {PASSENGER_CSV.name}...")

    try:
        # -----------------------------------
        # Check CSV
        # -----------------------------------

        if not PASSENGER_CSV.exists():
            logger.error(f"File not found: {PASSENGER_CSV}")
            stats["errors"] += 1
            return stats

        # -----------------------------------
        # Read CSV
        # -----------------------------------

        df = pd.read_csv(PASSENGER_CSV)

        stats["loaded"] = len(df)

        logger.info(
            f"Passenger journey records found: {stats['loaded']}"
        )

        valid_dicts = []

        # -----------------------------------
        # Process Records
        # -----------------------------------

        for _, row in df.iterrows():

            # -----------------------------------
            # Primary Key
            # -----------------------------------

            journey_id = clean_string(row.get("id"))

            if not journey_id:
                stats["skipped"] += 1
                continue

            # -----------------------------------
            # Entry Station
            # -----------------------------------

            entry_station_name = clean_string(
                row.get("entry_station")
            )

            if not entry_station_name:
                stats["skipped"] += 1
                continue

            entry_station_id = mapper.get_or_create_station(
                entry_station_name
            )

            # -----------------------------------
            # Exit Station
            # -----------------------------------

            exit_station_name = clean_string(
                row.get("exit_station")
            )

            if not exit_station_name:
                stats["skipped"] += 1
                continue

            exit_station_id = mapper.get_or_create_station(
                exit_station_name
            )

            # -----------------------------------
            # Build Record
            # -----------------------------------

            valid_dicts.append(
                {
                    "id": journey_id,

                    "entry_station_id": entry_station_id,
                    "entry_time": parse_datetime(
                        row.get("entry_time")
                    ),
                    "entry_gate": clean_string(
                        row.get("entry_gate")
                    ),

                    "exit_station_id": exit_station_id,
                    "exit_time": parse_datetime(
                        row.get("exit_time")
                    ),
                    "exit_gate": clean_string(
                        row.get("exit_gate")
                    ),

                    "travel_duration_mins": clean_int(
                        row.get("travel_duration_mins")
                    ),
                }
            )

        logger.info(
            f"Prepared {len(valid_dicts)} new passenger journey records"
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
                    insert(PassengerJourney)
                    .values(chunk)
                    .on_conflict_do_nothing(
                        index_elements=[PassengerJourney.id]
                    )
                    .returning(PassengerJourney.id)
                )

                result = db.execute(stmt)

                inserted_ids = result.fetchall()

                batch_inserted = len(inserted_ids)
                batch_skipped = len(chunk) - batch_inserted

                stats["inserted"] += batch_inserted
                stats["skipped"] += batch_skipped

                logger.info(
                    f"Inserted passenger journey batch: "
                    f"{batch_inserted}/{len(chunk)}"
                )

            db.commit()

            logger.info(
                "Passenger journey data committed successfully"
            )

        # -----------------------------------
        # Completion Summary
        # -----------------------------------

        logger.info("========================================")
        logger.info("Passenger journey loading completed")
        logger.info(f"Total records: {stats['loaded']}")
        logger.info(f"Inserted: {stats['inserted']}")
        logger.info(f"Skipped: {stats['skipped']}")
        logger.info(f"Errors: {stats['errors']}")
        logger.info("========================================")

    except Exception as e:
        logger.error(
            f"Error loading passenger journeys: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(
        time.time() - t0,
        2,
    )

    return stats