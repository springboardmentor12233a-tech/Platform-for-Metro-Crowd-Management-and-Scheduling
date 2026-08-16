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
    clean_bool,
    clean_float,
    clean_int,
    clean_string,
    parse_date,
)


def normalize_ticket_type(value):
    """
    Normalize ticket type values from the dataset
    to values supported by the TicketType enum.
    """

    value = clean_string(value)

    if not value:
        return None

    mapping = {
        "Single": "Single",
        "Return": "Return",
        "Smart Card": "Smart Card",
        "Token": "Token",
        "Pass": "Pass",
        "Tourist Card": "Tourist Card",
    }

    return mapping.get(value)


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
        # ==========================================================
        # CHECK CSV
        # ==========================================================

        if not TICKETING_CSV.exists():
            logger.error(f"File not found: {TICKETING_CSV}")
            stats["errors"] += 1
            return stats

        # ==========================================================
        # READ CSV
        # ==========================================================

        df = pd.read_csv(TICKETING_CSV)

        stats["loaded"] = len(df)

        logger.info(
            f"Ticket records found: {stats['loaded']}"
        )

        # ==========================================================
        # VALIDATE REQUIRED CSV COLUMNS
        # ==========================================================

        required_columns = {
            "id",
            "date",
            "from_station",
            "to_station",
            "distance_km",
            "fare",
            "cost_per_passenger",
            "passengers",
            "ticket_type",
            "remarks",
            "fare_per_km",
            "total_revenue",
            "cost_exceeds_fare",
            "year",
            "month",
            "day_of_week",
            "is_weekend",
            "od_pair",
            "distance_km_outlier",
            "fare_outlier",
            "cost_per_passenger_outlier",
            "passengers_outlier",
        }

        missing_columns = required_columns - set(df.columns)

        if missing_columns:
            logger.error(
                f"Missing required ticket columns: "
                f"{sorted(missing_columns)}"
            )

            stats["errors"] += 1
            return stats

        # ==========================================================
        # PREPARE RECORDS
        # ==========================================================

        valid_dicts = []

        for _, row in df.iterrows():

            # ------------------------------------------------------
            # PRIMARY KEY
            # ------------------------------------------------------

            ticket_id = clean_string(
                row.get("id")
            )

            if not ticket_id:
                stats["skipped"] += 1
                continue

            # ------------------------------------------------------
            # FROM STATION
            # ------------------------------------------------------

            from_station_name = clean_string(
                row.get("from_station")
            )

            if not from_station_name:
                stats["skipped"] += 1
                continue

            from_station_id = mapper.get_or_create_station(
                from_station_name
            )

            # ------------------------------------------------------
            # TO STATION
            # ------------------------------------------------------

            to_station_name = clean_string(
                row.get("to_station")
            )

            if not to_station_name:
                stats["skipped"] += 1
                continue

            to_station_id = mapper.get_or_create_station(
                to_station_name
            )

            # ------------------------------------------------------
            # TICKET TYPE
            # ------------------------------------------------------

            ticket_type = normalize_ticket_type(
                row.get("ticket_type")
            )

            if ticket_type is None:
                logger.warning(
                    f"Unknown ticket type for ticket "
                    f"{ticket_id}: "
                    f"{row.get('ticket_type')}"
                )

                stats["skipped"] += 1
                continue

            # ------------------------------------------------------
            # BUILD RECORD
            # ------------------------------------------------------

            valid_dicts.append(
                {
                    # Primary key
                    "id": ticket_id,

                    # Journey
                    "date": parse_date(
                        row.get("date")
                    ),

                    "from_station_id": from_station_id,

                    "to_station_id": to_station_id,

                    # Fare information
                    "distance_km": clean_float(
                        row.get("distance_km")
                    ),

                    "fare": clean_float(
                        row.get("fare")
                    ),

                    "cost_per_passenger": clean_float(
                        row.get("cost_per_passenger")
                    ),

                    "passengers": clean_int(
                        row.get("passengers")
                    ),

                    "ticket_type": ticket_type,

                    "remarks": clean_string(
                        row.get("remarks")
                    ),

                    "fare_per_km": clean_float(
                        row.get("fare_per_km")
                    ),

                    "total_revenue": clean_float(
                        row.get("total_revenue")
                    ),

                    "cost_exceeds_fare": clean_bool(
                        row.get("cost_exceeds_fare")
                    ),

                    # Derived features
                    "year": clean_int(
                        row.get("year")
                    ),

                    "month": clean_int(
                        row.get("month")
                    ),

                    "day_of_week": clean_string(
                        row.get("day_of_week")
                    ),

                    "is_weekend": clean_bool(
                        row.get("is_weekend")
                    ),

                    "od_pair": clean_string(
                        row.get("od_pair")
                    ),

                    # Outlier flags
                    "distance_km_outlier": clean_bool(
                        row.get("distance_km_outlier")
                    ),

                    "fare_outlier": clean_bool(
                        row.get("fare_outlier")
                    ),

                    "cost_per_passenger_outlier": clean_bool(
                        row.get(
                            "cost_per_passenger_outlier"
                        )
                    ),

                    "passengers_outlier": clean_bool(
                        row.get("passengers_outlier")
                    ),
                }
            )

        # ==========================================================
        # PREPARATION SUMMARY
        # ==========================================================

        logger.info(
            f"Prepared {len(valid_dicts)} valid ticket records"
        )

        if not valid_dicts:
            logger.warning(
                "No valid ticket records available for insertion"
            )

            stats["time"] = round(
                time.time() - t0,
                2,
            )

            return stats

        # ==========================================================
        # BULK INSERT
        # ==========================================================

        for chunk_number, chunk in enumerate(
            chunked_iterable(
                valid_dicts,
                CHUNK_SIZE,
            ),
            start=1,
        ):

            stmt = (
                insert(Ticket)
                .values(chunk)
                .on_conflict_do_nothing(
                    index_elements=[Ticket.id]
                )
                .returning(Ticket.id)
            )

            result = db.execute(stmt)

            inserted_ids = result.fetchall()

            batch_inserted = len(inserted_ids)
            batch_skipped = len(chunk) - batch_inserted

            stats["inserted"] += batch_inserted
            stats["skipped"] += batch_skipped

            logger.info(
                f"Inserted ticket batch {chunk_number}: "
                f"{batch_inserted}/{len(chunk)}"
            )

        # ==========================================================
        # COMMIT
        # ==========================================================

        db.commit()

        logger.info(
            "Ticket data committed successfully"
        )

        # ==========================================================
        # COMPLETION SUMMARY
        # ==========================================================

        logger.info("========================================")
        logger.info("Ticket loading completed")
        logger.info(
            f"Total records: {stats['loaded']}"
        )
        logger.info(
            f"Inserted: {stats['inserted']}"
        )
        logger.info(
            f"Skipped: {stats['skipped']}"
        )
        logger.info(
            f"Errors: {stats['errors']}"
        )
        logger.info("========================================")

    except Exception as e:

        logger.error(
            f"Error loading tickets: {e}",
            exc_info=True,
        )

        stats["errors"] += 1

        db.rollback()

    stats["time"] = round(
        time.time() - t0,
        2,
    )

    return stats