from pathlib import Path
from datetime import datetime

import pandas as pd
from sqlalchemy.orm import Session

from app.models.crowd_history import CrowdHistory

from .mapper import Mapper
from .logger import logger


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CROWD_HISTORY_CSV = (
    BASE_DIR
    / "datasets"
    / "crowd_history_preprocessed.csv"
)

CHUNK_SIZE = 2000


# ============================================================
# SAFE VALUE HELPERS
# ============================================================

def safe_int(value):
    """Convert value to Python int or return None."""

    if value is None:
        return None

    try:

        if pd.isna(value):
            return None

        return int(value)

    except (ValueError, TypeError):

        return None


def safe_float(value):
    """Convert value to Python float or return None."""

    if value is None:
        return None

    try:

        if pd.isna(value):
            return None

        return float(value)

    except (ValueError, TypeError):

        return None


def safe_timestamp(value):
    """
    Convert CSV timestamp into Python datetime.
    """

    if value is None:
        return None

    try:

        if pd.isna(value):
            return None

        timestamp = pd.to_datetime(
            value,
            errors="coerce",
        )

        if pd.isna(timestamp):
            return None

        return timestamp.to_pydatetime()

    except Exception:

        return None


# ============================================================
# LOAD CROWD HISTORY
# ============================================================

def load_crowd_history(
    db: Session,
    mapper: Mapper,
) -> dict:
    """
    Load crowd_history_preprocessed.csv
    into PostgreSQL.

    CSV columns:

        id
        station_name
        timestamp
        entry_count
        exit_count
        platform_count
        concourse_count
        crowd_density
    """

    start_time = datetime.now()

    logger.info(
        "Loading crowd_history_preprocessed.csv..."
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

    if not CROWD_HISTORY_CSV.exists():

        logger.error(
            f"Crowd history CSV not found: "
            f"{CROWD_HISTORY_CSV}"
        )

        result["errors"] = 1

        return result

    try:

        # ----------------------------------------------------
        # READ CSV
        # ----------------------------------------------------

        df = pd.read_csv(
            CROWD_HISTORY_CSV
        )

        result["loaded"] = len(df)

        logger.info(
            f"Crowd history records found: "
            f"{len(df)}"
        )

        # ----------------------------------------------------
        # REQUIRED COLUMNS
        # ----------------------------------------------------

        required_columns = [
            "id",
            "station_name",
            "timestamp",
            "entry_count",
            "exit_count",
            "platform_count",
            "concourse_count",
            "crowd_density",
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
        # EXISTING DATABASE IDS
        # ----------------------------------------------------

        existing_ids = {
            str(row[0]).strip()
            for row in db.query(
                CrowdHistory.id
            ).all()
        }

        logger.info(
            "Existing crowd history records "
            f"in database: {len(existing_ids)}"
        )

        # ----------------------------------------------------
        # PROCESS RECORDS
        # ----------------------------------------------------

        records = []

        seen_ids = set()

        for _, row in df.iterrows():

            try:

                # --------------------------------------------
                # RECORD ID
                # --------------------------------------------

                if pd.isna(row["id"]):

                    result["skipped"] += 1

                    continue

                record_id = str(
                    row["id"]
                ).strip()

                if not record_id:

                    result["skipped"] += 1

                    continue

                # Existing DB record
                if record_id in existing_ids:

                    result["skipped"] += 1

                    continue

                # Duplicate inside CSV
                if record_id in seen_ids:

                    result["skipped"] += 1

                    continue

                seen_ids.add(record_id)

                # --------------------------------------------
                # STATION NAME
                # --------------------------------------------

                if pd.isna(
                    row["station_name"]
                ):

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

                station_id = (
                    mapper.get_station_id(
                        station_name
                    )
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
                # TIMESTAMP
                # --------------------------------------------

                timestamp = safe_timestamp(
                    row["timestamp"]
                )

                if timestamp is None:

                    logger.warning(
                        f"Invalid timestamp for "
                        f"{record_id}: "
                        f"{row['timestamp']}"
                    )

                    result["skipped"] += 1

                    continue

                # --------------------------------------------
                # CROWD COUNTS
                # --------------------------------------------

                entry_count = safe_int(
                    row["entry_count"]
                )

                exit_count = safe_int(
                    row["exit_count"]
                )

                platform_count = safe_int(
                    row["platform_count"]
                )

                concourse_count = safe_int(
                    row["concourse_count"]
                )

                # --------------------------------------------
                # CROWD DENSITY
                # --------------------------------------------

                crowd_density = safe_float(
                    row["crowd_density"]
                )

                # --------------------------------------------
                # CREATE ORM OBJECT
                # --------------------------------------------

                crowd_record = CrowdHistory(

                    id=record_id,

                    station_id=int(
                        station_id
                    ),

                    timestamp=timestamp,

                    entry_count=entry_count,

                    exit_count=exit_count,

                    platform_count=platform_count,

                    concourse_count=concourse_count,

                    crowd_density=crowd_density,
                )

                records.append(
                    crowd_record
                )

            except Exception as row_error:

                logger.warning(
                    f"Skipping crowd history "
                    f"{row.get('id', 'UNKNOWN')}: "
                    f"{row_error}"
                )

                result["skipped"] += 1

        # ----------------------------------------------------
        # PREPARED RECORDS
        # ----------------------------------------------------

        logger.info(
            f"Prepared {len(records)} "
            f"crowd history records"
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
                    f"Inserted crowd history "
                    f"batch: "
                    f"{inserted}/{len(records)}"
                )

            except Exception as batch_error:

                db.rollback()

                logger.error(
                    "Crowd history batch failed: "
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
                            f"Skipping crowd history "
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
            "Crowd history loading completed"
        )

        logger.info(
            f"Total records: "
            f"{result['loaded']}"
        )

        logger.info(
            f"Inserted: "
            f"{result['inserted']}"
        )

        logger.info(
            f"Skipped: "
            f"{result['skipped']}"
        )

        logger.info(
            "========================================"
        )

    except Exception as error:

        db.rollback()

        logger.exception(
            f"Error loading crowd history: "
            f"{error}"
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