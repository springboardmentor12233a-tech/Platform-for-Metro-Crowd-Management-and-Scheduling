from pathlib import Path
from datetime import datetime

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.occupancy import Occupancy

from .mapper import Mapper
from .logger import logger


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

OCCUPANCY_CSV = (
    BASE_DIR / "datasets" / "occupancy_preprocessed.csv"
)

# Number of records processed per database batch
CHUNK_SIZE = 2000


# ============================================================
# SAFE VALUE HELPERS
# ============================================================

def safe_int(value):
    """
    Convert pandas/numpy numeric value to Python int.
    Return None for missing/invalid values.
    """

    if value is None:
        return None

    try:
        if pd.isna(value):
            return None

        return int(value)

    except (ValueError, TypeError):
        return None


def safe_float(value):
    """
    Convert pandas/numpy numeric value to Python float.
    Return None for missing/invalid values.
    """

    if value is None:
        return None

    try:
        if pd.isna(value):
            return None

        return float(value)

    except (ValueError, TypeError):
        return None


def normalize_crowd_level(value):
    """
    Convert CSV crowd-level values to the PostgreSQL
    crowd_level enum.

    PostgreSQL enum:

        LOW
        MEDIUM
        HIGH
        VERY_HIGH
    """

    if value is None:
        return None

    if pd.isna(value):
        return None

    value = str(value).strip().upper()

    mapping = {
        "LOW": "LOW",
        "MEDIUM": "MEDIUM",
        "HIGH": "HIGH",
        "CRITICAL": "VERY_HIGH",
        "VERY HIGH": "VERY_HIGH",
        "VERY_HIGH": "VERY_HIGH",
    }

    return mapping.get(value)


# ============================================================
# LOAD OCCUPANCY
# ============================================================

def load_occupancy(
    db: Session,
    mapper: Mapper
) -> dict:
    """
    Load occupancy_preprocessed.csv into PostgreSQL.

    CSV columns:

        id
        train_id
        station_name
        timestamp
        occupancy
        capacity
        occupancy_percentage
        crowd_level

    The loader is designed to be safely rerunnable.

    Existing occupancy IDs are skipped.

    Newly created stations are committed before occupancy
    insertion so that a failed occupancy batch cannot
    roll them back.
    """

    start_time = datetime.now()

    logger.info(
        "Loading occupancy_preprocessed.csv..."
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

    if not OCCUPANCY_CSV.exists():

        logger.error(
            f"Occupancy CSV not found: {OCCUPANCY_CSV}"
        )

        result["errors"] = 1

        return result

    try:

        # ----------------------------------------------------
        # READ CSV
        # ----------------------------------------------------

        df = pd.read_csv(OCCUPANCY_CSV)

        result["loaded"] = len(df)

        logger.info(
            f"Occupancy records found: {len(df)}"
        )

        # ----------------------------------------------------
        # CHECK REQUIRED COLUMNS
        # ----------------------------------------------------

        required_columns = [
            "id",
            "train_id",
            "station_name",
            "timestamp",
            "occupancy",
            "capacity",
            "occupancy_percentage",
            "crowd_level",
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
        # LOAD EXISTING OCCUPANCY IDS
        # ----------------------------------------------------
        #
        # This is important because the database already
        # contains some occupancy records.
        #
        # Example:
        #
        # REC_039973 already exists
        #
        # We must skip it instead of trying to insert it again.
        # ----------------------------------------------------

        existing_ids = {
            row[0]
            for row in db.query(Occupancy.id).all()
        }

        logger.info(
            f"Existing occupancy records in database: "
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

                # --------------------------------------------
                # SKIP RECORD ALREADY IN DATABASE
                # --------------------------------------------

                if record_id in existing_ids:

                    logger.debug(
                        f"Skipping existing occupancy ID: "
                        f"{record_id}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # AVOID DUPLICATES INSIDE CSV
                # --------------------------------------------

                if record_id in seen_ids:

                    logger.warning(
                        f"Duplicate occupancy ID in CSV: "
                        f"{record_id}"
                    )

                    result["skipped"] += 1
                    continue

                seen_ids.add(record_id)

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
                # GET / CREATE STATION
                # --------------------------------------------

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

                timestamp = pd.to_datetime(
                    row["timestamp"],
                    errors="coerce"
                )

                if pd.isna(timestamp):

                    logger.warning(
                        f"Invalid timestamp for "
                        f"{record_id}"
                    )

                    result["skipped"] += 1
                    continue

                timestamp = timestamp.to_pydatetime()

                # --------------------------------------------
                # NUMERIC VALUES
                # --------------------------------------------

                occupancy = safe_int(
                    row["occupancy"]
                )

                capacity = safe_int(
                    row["capacity"]
                )

                occupancy_percentage = safe_float(
                    row["occupancy_percentage"]
                )

                # --------------------------------------------
                # CROWD LEVEL
                # --------------------------------------------

                crowd_level = normalize_crowd_level(
                    row["crowd_level"]
                )

                # --------------------------------------------
                # PREPARE DATABASE RECORD
                # --------------------------------------------
                #
                # Store dictionaries instead of ORM objects.
                # This makes rollback/retry much safer.
                # --------------------------------------------

                record = {
                    "id": record_id,
                    "train_id": train_id,
                    "station_id": int(station_id),
                    "timestamp": timestamp,
                    "occupancy": occupancy,
                    "capacity": capacity,
                    "occupancy_percentage": (
                        occupancy_percentage
                    ),
                    "crowd_level": crowd_level,
                }

                records.append(record)

                # Keep the in-memory ID set updated
                existing_ids.add(record_id)

            except Exception as row_error:

                logger.warning(
                    f"Skipping occupancy record "
                    f"{row.get('id', 'UNKNOWN')}: "
                    f"{row_error}"
                )

                result["skipped"] += 1

        # ----------------------------------------------------
        # PREPARED RECORD COUNT
        # ----------------------------------------------------

        logger.info(
            f"Prepared {len(records)} new occupancy records"
        )

        # ----------------------------------------------------
        # COMMIT STATION CREATIONS
        # ----------------------------------------------------
        #
        # Mapper may have created stations such as:
        #
        # IFFCO Chowk
        # MG Road
        #
        # Commit them BEFORE occupancy insertion.
        #
        # This prevents an occupancy batch failure from
        # deleting those stations through rollback.
        # ----------------------------------------------------

        try:

            db.commit()

            logger.info(
                "Station mappings committed successfully"
            )

        except Exception as station_commit_error:

            db.rollback()

            logger.error(
                "Failed to commit station mappings: "
                f"{station_commit_error}"
            )

            result["errors"] = 1

            return result

        # ----------------------------------------------------
        # INSERT OCCUPANCY IN INDEPENDENT BATCHES
        # ----------------------------------------------------

        inserted = 0

        for start in range(
            0,
            len(records),
            CHUNK_SIZE
        ):

            batch = records[
                start:start + CHUNK_SIZE
            ]

            if not batch:
                continue

            batch_start = start

            batch_end = min(
                start + CHUNK_SIZE,
                len(records)
            )

            try:

                # ------------------------------------------------
                # PostgreSQL INSERT ... ON CONFLICT DO NOTHING
                # ------------------------------------------------
                #
                # This makes the operation idempotent.
                #
                # If an ID already exists, PostgreSQL simply
                # ignores that record instead of failing the
                # complete batch.
                # ------------------------------------------------

                stmt = (
                    insert(Occupancy)
                    .values(batch)
                    .on_conflict_do_nothing(
                        index_elements=[
                            Occupancy.id
                        ]
                    )
                    .returning(Occupancy.id)
                )

                execution_result = db.execute(stmt)

                db.commit()
                
                # Accurately count returned rows instead of using rowcount
                batch_inserted = len(execution_result.fetchall())

                inserted += batch_inserted

                batch_skipped = (
                    len(batch) - batch_inserted
                )

                if batch_skipped > 0:
                    result["skipped"] += batch_skipped

                logger.info(
                    f"Inserted occupancy batch: "
                    f"{batch_end}/{len(records)} "
                    f"("
                    f"{batch_inserted} inserted, "
                    f"{batch_skipped} skipped"
                    f")"
                )

            except Exception as batch_error:

                # Rollback ONLY this batch.
                db.rollback()

                logger.error(
                    f"Occupancy batch failed "
                    f"({batch_start + 1}-"
                    f"{batch_end}): "
                    f"{batch_error}"
                )

                # ------------------------------------------------
                # FALLBACK: RECORD-BY-RECORD INSERTION
                # ------------------------------------------------

                for record in batch:

                    try:

                        stmt = (
                            insert(Occupancy)
                            .values(record)
                            .on_conflict_do_nothing(
                                index_elements=[
                                    Occupancy.id
                                ]
                            )
                            .returning(Occupancy.id)
                        )

                        execution_result = db.execute(stmt)

                        db.commit()

                        # Check if a row was actually returned/inserted
                        if execution_result.fetchone():
                            inserted += 1
                        else:
                            result["skipped"] += 1

                    except Exception as record_error:

                        db.rollback()

                        logger.warning(
                            f"Skipping occupancy "
                            f"{record['id']}: "
                            f"{record_error}"
                        )

                        result["skipped"] += 1

        # ----------------------------------------------------
        # FINAL RESULT
        # ----------------------------------------------------

        result["inserted"] = inserted

        logger.info(
            "========================================"
        )

        logger.info(
            "Occupancy loading completed"
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
            f"Errors: {result['errors']}"
        )

        logger.info(
            "========================================"
        )

    except Exception as error:

        db.rollback()

        logger.exception(
            f"Error loading occupancy: {error}"
        )

        result["errors"] = 1

    finally:

        elapsed = (
            datetime.now() - start_time
        ).total_seconds()

        result["time"] = round(
            elapsed,
            2
        )

    return result