from pathlib import Path
from datetime import datetime

import pandas as pd
from sqlalchemy.orm import Session

from app.models.crowd_prediction import CrowdPrediction
from app.models.enums import CrowdLevel

from .mapper import Mapper
from .logger import logger


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CROWD_PREDICTION_CSV = (
    BASE_DIR
    / "datasets"
    / "crowd_prediction_preprocessed.csv"
)

CHUNK_SIZE = 2000


# ============================================================
# SAFE VALUE HELPERS
# ============================================================

def safe_int(value):
    """
    Convert a value to Python int.

    Return None for missing or invalid values.
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
    Convert a value to Python float.

    Return None for missing or invalid values.
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
    Convert CSV crowd-level value to CrowdLevel enum.
    """

    if value is None:
        return None

    if pd.isna(value):
        return None

    value = str(value).strip()

    mapping = {
        "Low": CrowdLevel.LOW,
        "Medium": CrowdLevel.MEDIUM,
        "High": CrowdLevel.HIGH,
        "Very High": CrowdLevel.VERY_HIGH,

        # Dataset uses Critical,
        # database uses Very High as the highest level
        "Critical": CrowdLevel.VERY_HIGH,

        # Extra protection for capitalization variations
        "LOW": CrowdLevel.LOW,
        "MEDIUM": CrowdLevel.MEDIUM,
        "HIGH": CrowdLevel.HIGH,
        "VERY HIGH": CrowdLevel.VERY_HIGH,
        "VERY_HIGH": CrowdLevel.VERY_HIGH,
        "CRITICAL": CrowdLevel.VERY_HIGH,
    }

    return mapping.get(value)


# ============================================================
# LOAD CROWD PREDICTION
# ============================================================

def load_crowd_prediction(
    db: Session,
    mapper: Mapper
) -> dict:
    """
    Load crowd_prediction_preprocessed.csv
    into the crowd_predictions table.

    CSV columns:

        id
        station_name
        prediction_time
        predicted_entries
        predicted_exits
        predicted_platform_crowd
        predicted_crowd_level
        confidence_score
    """

    start_time = datetime.now()

    logger.info(
        "Loading crowd_prediction_preprocessed.csv..."
    )

    result = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    try:

        # ====================================================
        # CHECK FILE
        # ====================================================

        if not CROWD_PREDICTION_CSV.exists():

            logger.error(
                f"Crowd prediction CSV not found: "
                f"{CROWD_PREDICTION_CSV}"
            )

            result["errors"] = 1

            return result

        # ====================================================
        # READ CSV
        # ====================================================

        df = pd.read_csv(
            CROWD_PREDICTION_CSV
        )

        result["loaded"] = len(df)

        logger.info(
            f"Crowd prediction records found: {len(df)}"
        )

        # ====================================================
        # REQUIRED COLUMNS
        # ====================================================

        required_columns = [
            "id",
            "station_name",
            "prediction_time",
            "predicted_entries",
            "predicted_exits",
            "predicted_platform_crowd",
            "predicted_crowd_level",
            "confidence_score",
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

        # ====================================================
        # EXISTING DATABASE IDs
        # ====================================================

        existing_ids = {
            str(row[0]).strip()
            for row in db.query(
                CrowdPrediction.id
            ).all()
        }

        logger.info(
            f"Existing crowd prediction records "
            f"in database: {len(existing_ids)}"
        )

        # ====================================================
        # PROCESS RECORDS
        # ====================================================

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

                record_id = str(
                    row["id"]
                ).strip()

                if not record_id:

                    result["skipped"] += 1
                    continue

                # Skip duplicate IDs inside CSV
                if record_id in seen_ids:

                    result["skipped"] += 1
                    continue

                seen_ids.add(record_id)

                # Skip records already in DB
                if record_id in existing_ids:

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # STATION
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
                # PREDICTION TIME
                # --------------------------------------------

                prediction_time = pd.to_datetime(
                    row["prediction_time"],
                    errors="coerce"
                )

                if pd.isna(prediction_time):

                    logger.warning(
                        f"Invalid prediction time "
                        f"for {record_id}"
                    )

                    result["skipped"] += 1
                    continue

                prediction_time = (
                    prediction_time.to_pydatetime()
                )

                # --------------------------------------------
                # NUMERIC VALUES
                # --------------------------------------------

                predicted_entries = safe_int(
                    row["predicted_entries"]
                )

                predicted_exits = safe_int(
                    row["predicted_exits"]
                )

                predicted_platform_crowd = safe_int(
                    row["predicted_platform_crowd"]
                )

                confidence_score = safe_float(
                    row["confidence_score"]
                )

                # --------------------------------------------
                # CROWD LEVEL
                # --------------------------------------------

                predicted_crowd_level = (
                    normalize_crowd_level(
                        row["predicted_crowd_level"]
                    )
                )

                # If a non-empty value cannot be mapped,
                # skip the record.
                if (
                    pd.notna(
                        row["predicted_crowd_level"]
                    )
                    and predicted_crowd_level is None
                ):

                    logger.warning(
                        f"Invalid crowd level "
                        f"for {record_id}: "
                        f"{row['predicted_crowd_level']}"
                    )

                    result["skipped"] += 1
                    continue

                # --------------------------------------------
                # CREATE ORM OBJECT
                # --------------------------------------------

                prediction_record = CrowdPrediction(

                    id=record_id,

                    station_id=int(
                        station_id
                    ),

                    prediction_time=prediction_time,

                    predicted_entries=(
                        predicted_entries
                    ),

                    predicted_exits=(
                        predicted_exits
                    ),

                    predicted_platform_crowd=(
                        predicted_platform_crowd
                    ),

                    predicted_crowd_level=(
                        predicted_crowd_level
                    ),

                    confidence_score=(
                        confidence_score
                    ),
                )

                records.append(
                    prediction_record
                )

            except Exception as row_error:

                logger.warning(
                    f"Skipping crowd prediction "
                    f"{row.get('id', 'UNKNOWN')}: "
                    f"{row_error}"
                )

                result["skipped"] += 1

        # ====================================================
        # INSERT IN BATCHES
        # ====================================================

        logger.info(
            f"Prepared {len(records)} new "
            f"crowd prediction records"
        )

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

            try:

                db.add_all(batch)

                db.flush()

                inserted += len(batch)

                logger.info(
                    f"Inserted crowd prediction batch: "
                    f"{inserted}/{len(records)}"
                )

            except Exception as batch_error:

                db.rollback()

                logger.error(
                    f"Crowd prediction batch failed: "
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
                            f"Skipping crowd prediction "
                            f"{record.id}: "
                            f"{record_error}"
                        )

                        result["skipped"] += 1

        # ====================================================
        # COMMIT
        # ====================================================

        db.commit()

        result["inserted"] = inserted

        logger.info(
            "========================================"
        )

        logger.info(
            "Crowd prediction loading completed"
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
            f"Error loading crowd prediction: "
            f"{error}"
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