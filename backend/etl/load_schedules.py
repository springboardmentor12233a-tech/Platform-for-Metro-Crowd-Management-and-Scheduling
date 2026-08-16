from pathlib import Path
from datetime import datetime, time

import pandas as pd
from sqlalchemy.orm import Session

from app.models.schedules import Schedule
from app.models.enums import DayType

from .mapper import Mapper
from .logger import logger


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

SCHEDULES_CSV = (
    BASE_DIR / "datasets" / "schedules_preprocessed.csv"
)

CHUNK_SIZE = 2000


# ============================================================
# SAFE HELPERS
# ============================================================

def safe_int(value):
    """Convert a value to Python int."""

    if value is None:
        return None

    try:
        if pd.isna(value):
            return None

        return int(value)

    except (ValueError, TypeError):
        return None


def safe_time(value):
    """
    Convert CSV time value such as:

        06:00:00

    into Python datetime.time.
    """

    if value is None:
        return None

    try:

        if pd.isna(value):
            return None

        value = str(value).strip()

        if not value:
            return None

        parsed = pd.to_datetime(
            value,
            format="%H:%M:%S",
            errors="coerce",
        )

        if pd.isna(parsed):
            return None

        return parsed.time()

    except Exception:
        return None


def normalize_day_type(value):
    """
    Convert CSV day_type to the application's DayType enum.

    CSV:
        Weekday
        Saturday
        Sunday

    Application enum:
        Weekday
        Weekend
        Holiday
    """

    if value is None:
        return None

    try:

        if pd.isna(value):
            return None

        value = str(value).strip().lower()

        mapping = {
            "weekday": DayType.WEEKDAY,
            "saturday": DayType.WEEKEND,
            "sunday": DayType.WEEKEND,
            "weekend": DayType.WEEKEND,
            "holiday": DayType.HOLIDAY,
        }

        return mapping.get(value)

    except Exception:
        return None


# ============================================================
# LOAD SCHEDULES
# ============================================================

def load_schedules(
    db: Session,
    mapper: Mapper,
) -> dict:
    """
    Load schedules_preprocessed.csv into PostgreSQL.

    CSV columns:

        id
        train_id
        station_name
        arrival_time
        departure_time
        stop_sequence
        day_type
        platform
    """

    start_time = datetime.now()

    logger.info(
        "Loading schedules_preprocessed.csv..."
    )

    result = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not SCHEDULES_CSV.exists():

        logger.error(
            f"Schedules CSV not found: {SCHEDULES_CSV}"
        )

        result["errors"] = 1
        return result

    try:

        # ----------------------------------------------------
        # READ CSV
        # ----------------------------------------------------

        df = pd.read_csv(SCHEDULES_CSV)

        result["loaded"] = len(df)

        logger.info(
            f"Schedule records found: {len(df)}"
        )

        # ----------------------------------------------------
        # REQUIRED COLUMNS
        # ----------------------------------------------------

        required_columns = [
            "id",
            "train_id",
            "station_name",
            "arrival_time",
            "departure_time",
            "stop_sequence",
            "day_type",
            "platform",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:

            logger.error(
                "Missing required columns: "
                + ", ".join(missing_columns)
            )

            result["errors"] = 1
            return result

        # ----------------------------------------------------
        # EXISTING SCHEDULE IDs
        # ----------------------------------------------------

        existing_ids = {
            str(row[0]).strip()
            for row in db.query(Schedule.id).all()
        }

        logger.info(
            f"Existing schedule records in database: "
            f"{len(existing_ids)}"
        )

        # ----------------------------------------------------
        # PROCESS RECORDS
        # ----------------------------------------------------

        records = []

        seen_ids = set()

        for _, row in df.iterrows():

            try:

                # --------------------------------------------
                # ID
                # --------------------------------------------

                if pd.isna(row["id"]):

                    result["skipped"] += 1
                    continue

                schedule_id = str(
                    row["id"]
                ).strip()

                if not schedule_id:

                    result["skipped"] += 1
                    continue

                # Existing DB record
                if schedule_id in existing_ids:

                    result["skipped"] += 1
                    continue

                # Duplicate inside CSV
                if schedule_id in seen_ids:

                    result["skipped"] += 1
                    continue

                seen_ids.add(schedule_id)

                # --------------------------------------------
                # TRAIN ID
                # --------------------------------------------

                if pd.isna(row["train_id"]):

                    result["skipped"] += 1
                    continue

                train_id = str(
                    row["train_id"]
                ).strip()

                if not train_id:

                    result["skipped"] += 1
                    continue

                # ------------------------------------------------
                # VERIFY TRAIN EXISTS
                # ------------------------------------------------

                train_exists = (
                    db.query(
                        Schedule.train_id
                    )
                    .filter(
                        Schedule.train_id == train_id
                    )
                    .first()
                )

                # We don't use Schedule for this lookup.
                # Mapper/database should already contain all trains.
                # The actual FK will validate this during insertion.

                # --------------------------------------------
                # STATION NAME
                # --------------------------------------------

                if pd.isna(row["station_name"]):

                    result["skipped"] += 1
                    continue

                station_name = str(
                    row["station_name"]
                ).strip()

                if not station_name:

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # GET STATION ID
                # --------------------------------------------

                station_id = mapper.get_station_id(
                    station_name
                )

                if station_id is None:

                    station_id = (
                        mapper.get_or_create_station(
                            station_name
                        )
                    )

                if station_id is None:

                    logger.warning(
                        f"Station mapping failed: "
                        f"{station_name}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # ARRIVAL TIME
                # --------------------------------------------

                arrival_time = safe_time(
                    row["arrival_time"]
                )

                if arrival_time is None:

                    logger.warning(
                        f"Invalid arrival time for "
                        f"{schedule_id}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # DEPARTURE TIME
                # --------------------------------------------

                departure_time = safe_time(
                    row["departure_time"]
                )

                if departure_time is None:

                    logger.warning(
                        f"Invalid departure time for "
                        f"{schedule_id}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # STOP SEQUENCE
                # --------------------------------------------

                stop_sequence = safe_int(
                    row["stop_sequence"]
                )

                if stop_sequence is None:

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # DAY TYPE
                # --------------------------------------------

                day_type = normalize_day_type(
                    row["day_type"]
                )

                if day_type is None:

                    logger.warning(
                        f"Invalid day type for "
                        f"{schedule_id}: "
                        f"{row['day_type']}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # PLATFORM
                # --------------------------------------------

                if pd.isna(row["platform"]):

                    platform = None

                else:

                    platform = str(
                        row["platform"]
                    ).strip()

                    if not platform:
                        platform = None

                # --------------------------------------------
                # CREATE SCHEDULE
                # --------------------------------------------

                schedule_record = Schedule(

                    id=schedule_id,

                    train_id=train_id,

                    station_id=int(
                        station_id
                    ),

                    arrival_time=arrival_time,

                    departure_time=departure_time,

                    stop_sequence=stop_sequence,

                    day_type=day_type,

                    platform=platform,
                )

                records.append(
                    schedule_record
                )

            except Exception as row_error:

                logger.warning(
                    f"Skipping schedule "
                    f"{row.get('id', 'UNKNOWN')}: "
                    f"{row_error}"
                )

                result["skipped"] += 1

        # ----------------------------------------------------
        # PREPARED RECORDS
        # ----------------------------------------------------

        logger.info(
            f"Prepared {len(records)} schedule records"
        )

        # ----------------------------------------------------
        # INSERT IN BATCHES
        # ----------------------------------------------------

        inserted = 0

        for start in range(
            0,
            len(records),
            CHUNK_SIZE,
        ):

            batch = records[
                start:start + CHUNK_SIZE
            ]

            if not batch:
                continue

            try:

                db.add_all(batch)

                db.flush()

                inserted += len(batch)

                logger.info(
                    f"Inserted schedule batch: "
                    f"{inserted}/{len(records)}"
                )

            except Exception as batch_error:

                # IMPORTANT:
                # Rollback the failed batch.
                db.rollback()

                logger.error(
                    f"Schedule batch failed: "
                    f"{batch_error}"
                )

                # --------------------------------------------
                # FALLBACK: RECORD BY RECORD
                # --------------------------------------------

                for record in batch:

                    try:

                        db.add(record)

                        db.flush()

                        inserted += 1

                    except Exception as record_error:

                        db.rollback()

                        logger.warning(
                            f"Skipping schedule "
                            f"{record.id}: "
                            f"{record_error}"
                        )

                        result["skipped"] += 1

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        db.commit()

        result["inserted"] = inserted

        logger.info(
            "========================================"
        )

        logger.info(
            "Schedule loading completed"
        )

        logger.info(
            f"Total records: {result['loaded']}"
        )

        logger.info(
            f"Inserted: {result['inserted']}"
        )

        logger.info(
            f"Skipped: {result['skipped']}"
        )

        logger.info(
            "========================================"
        )

    except Exception as error:

        db.rollback()

        logger.exception(
            f"Error loading schedules: {error}"
        )

        result["errors"] = 1

    finally:

        elapsed = (
            datetime.now() - start_time
        ).total_seconds()

        result["time"] = round(
            elapsed,
            2,
        )

    return result