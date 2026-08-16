from datetime import datetime
import time

import pandas as pd
from sqlalchemy.orm import Session

from app.models.train import Train
from app.models.station import Station

from .config import TRAINS_CSV
from .logger import logger


# ============================================================
# STATUS NORMALIZATION
# ============================================================

STATUS_MAP = {
    "RUNNING": "ACTIVE",
    "ACTIVE": "ACTIVE",

    "MAINTENANCE": "MAINTENANCE",

    "DELAYED": "DELAYED",

    "OUT_OF_SERVICE": "OUT_OF_SERVICE",
    "OUT OF SERVICE": "OUT_OF_SERVICE",

    # Your CSV contains "Idle", but the DB enum
    # does not have IDLE.
    "IDLE": "ACTIVE",
}


# ============================================================
# SAFE VALUE HELPERS
# ============================================================

def clean_string(value):
    """
    Convert pandas values into clean Python strings.
    Return None for empty/NaN values.
    """

    if value is None:
        return None

    if pd.isna(value):
        return None

    value = str(value).strip()

    if value == "":
        return None

    return value


def clean_int(value):
    """
    Convert pandas numeric value to Python int.
    """

    if value is None or pd.isna(value):
        return None

    return int(value)


def clean_float(value):
    """
    Convert pandas numeric value to Python float.
    """

    if value is None or pd.isna(value):
        return None

    return float(value)


# ============================================================
# STATUS CONVERTER
# ============================================================

def normalize_status(value):

    value = clean_string(value)

    if not value:
        return "ACTIVE"

    value = value.upper()

    return STATUS_MAP.get(
        value,
        "ACTIVE"
    )


# ============================================================
# UNIQUE TRAIN NUMBER
# ============================================================

def generate_unique_train_number(
    original_number,
    train_id,
    used_numbers
):
    """
    Keep the original train number whenever possible.

    If it already exists, generate a deterministic
    unique number such as:

        DL-7658-TRN099
        DL-4770-TRN196
    """

    original_number = clean_string(
        original_number
    )

    train_id = clean_string(train_id)

    if not original_number:
        original_number = f"UNKNOWN-{train_id}"

    # --------------------------------------------------------
    # Original number is available
    # --------------------------------------------------------

    if original_number not in used_numbers:

        used_numbers.add(original_number)

        return original_number

    # --------------------------------------------------------
    # Duplicate number
    # --------------------------------------------------------

    candidate = (
        f"{original_number}-"
        f"{train_id}"
    )

    if candidate not in used_numbers:

        used_numbers.add(candidate)

        return candidate

    # --------------------------------------------------------
    # Extremely unlikely fallback
    # --------------------------------------------------------

    counter = 2

    while True:

        candidate = (
            f"{original_number}-"
            f"{train_id}-{counter}"
        )

        if candidate not in used_numbers:

            used_numbers.add(candidate)

            return candidate

        counter += 1


# ============================================================
# LOAD TRAINS
# ============================================================

def load_trains(db: Session):

    start_time = time.time()

    print()
    print("========================================")
    print("Loading trains...")
    print("========================================")

    logger.info(
        "Loading trains_preprocessed.csv..."
    )

    result = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "duplicate_ids": 0,
        "duplicate_train_numbers": 0,
        "missing_stations_created": 0,
        "errors": 0,
        "time": 0,
    }

    try:

        # ====================================================
        # LOAD CSV
        # ====================================================

        df = pd.read_csv(
            TRAINS_CSV
        )

        result["loaded"] = len(df)

        print(
            f"Train records found: {len(df)}"
        )

        # ====================================================
        # LOAD EXISTING STATIONS
        # ====================================================

        stations = (
            db.query(Station)
            .all()
        )

        station_cache = {}

        for station in stations:

            if station.station_name:

                station_cache[
                    station.station_name.strip().lower()
                ] = station.id

        print(
            f"Existing stations available: "
            f"{len(station_cache)}"
        )

        # ====================================================
        # LOAD EXISTING TRAINS
        # ====================================================

        existing_trains = (
            db.query(Train)
            .all()
        )

        existing_ids = set()
        used_train_numbers = set()

        for train in existing_trains:

            if train.id:

                existing_ids.add(
                    str(train.id).strip()
                )

            if train.train_number:

                used_train_numbers.add(
                    str(
                        train.train_number
                    ).strip()
                )

        print(
            f"Existing trains in database: "
            f"{len(existing_trains)}"
        )

        # ====================================================
        # DETECT DUPLICATES INSIDE CSV
        # ====================================================

        source_ids = set()

        source_train_numbers = set()

        records = []

        # ====================================================
        # PROCESS EVERY TRAIN
        # ====================================================

        for _, row in df.iterrows():

            try:

                # ------------------------------------------------
                # BASIC VALUES
                # ------------------------------------------------

                train_id = clean_string(
                    row["id"]
                )

                original_train_number = clean_string(
                    row["train_number"]
                )

                train_name = clean_string(
                    row["train_name"]
                )

                line = clean_string(
                    row["line"]
                )

                current_station_name = clean_string(
                    row["current_station"]
                )

                # ------------------------------------------------
                # VALIDATE ID
                # ------------------------------------------------

                if not train_id:

                    logger.warning(
                        "Skipping train with empty ID"
                    )

                    result["skipped"] += 1

                    continue

                # ------------------------------------------------
                # DUPLICATE SOURCE ID
                # ------------------------------------------------

                if train_id in source_ids:

                    print(
                        f"Skipping duplicate source ID: "
                        f"{train_id}"
                    )

                    result["duplicate_ids"] += 1
                    result["skipped"] += 1

                    continue

                source_ids.add(
                    train_id
                )

                # ------------------------------------------------
                # EXISTING DATABASE ID
                # ------------------------------------------------

                if train_id in existing_ids:

                    print(
                        f"Skipping existing train ID: "
                        f"{train_id}"
                    )

                    result["skipped"] += 1

                    continue

                # ------------------------------------------------
                # TRAIN NUMBER
                # ------------------------------------------------

                train_number = (
                    generate_unique_train_number(
                        original_train_number,
                        train_id,
                        used_train_numbers
                    )
                )

                # Detect duplicate from source
                if (
                    original_train_number
                    and
                    original_train_number
                    in source_train_numbers
                ):

                    result[
                        "duplicate_train_numbers"
                    ] += 1

                source_train_numbers.add(
                    original_train_number
                )

                # If DB already contained the original
                # number, generated number will be different.
                if (
                    original_train_number
                    and
                    train_number
                    != original_train_number
                ):

                    result[
                        "duplicate_train_numbers"
                    ] += 1

                    print(
                        f"Duplicate train number: "
                        f"{original_train_number}"
                        f" -> "
                        f"{train_number}"
                    )

                # ------------------------------------------------
                # CURRENT STATION
                # ------------------------------------------------

                current_station_id = None

                if current_station_name:

                    station_key = (
                        current_station_name
                        .strip()
                        .lower()
                    )

                    # --------------------------------------------
                    # Existing station
                    # --------------------------------------------

                    current_station_id = (
                        station_cache.get(
                            station_key
                        )
                    )

                    # --------------------------------------------
                    # Create missing station
                    # --------------------------------------------

                    if current_station_id is None:

                        existing_station = (
                            db.query(Station)
                            .filter(
                                Station.station_name
                                ==
                                current_station_name
                            )
                            .first()
                        )

                        if existing_station:

                            current_station_id = (
                                existing_station.id
                            )

                        else:

                            new_station = Station(
                                station_name=
                                    current_station_name
                            )

                            db.add(
                                new_station
                            )

                            db.flush()

                            current_station_id = (
                                new_station.id
                            )

                            result[
                                "missing_stations_created"
                            ] += 1

                            print(
                                f"Created missing station: "
                                f"{current_station_name}"
                                f" -> ID "
                                f"{current_station_id}"
                            )

                        station_cache[
                            station_key
                        ] = current_station_id

                # ------------------------------------------------
                # STATUS
                # ------------------------------------------------

                status = normalize_status(
                    row["status"]
                )

                # ------------------------------------------------
                # CREATE TRAIN
                # ------------------------------------------------

                train = Train(

                    id=train_id,

                    train_number=
                        train_number,

                    train_name=
                        train_name,

                    line=
                        line,

                    capacity=
                        clean_int(
                            row["capacity"]
                        ),

                    current_station_id=
                        current_station_id,

                    status=
                        status,

                    speed_limit_kmh=
                        clean_float(
                            row["speed_limit_kmh"]
                        ),

                    manufacturer=
                        clean_string(
                            row["manufacturer"]
                        ),

                    model=
                        clean_string(
                            row["model"]
                        ),

                    year_of_manufacture=
                        clean_int(
                            row[
                                "year_of_manufacture"
                            ]
                        ),
                )

                records.append(
                    train
                )

                existing_ids.add(
                    train_id
                )

            except Exception as row_error:

                logger.error(
                    f"Error processing train "
                    f"row: {row_error}"
                )

                result["errors"] += 1

        # ====================================================
        # INSERT ALL TRAIN RECORDS
        # ====================================================

        if records:

            db.add_all(
                records
            )

            db.commit()

            result["inserted"] = len(
                records
            )

        else:

            db.commit()

        # ====================================================
        # FINISH
        # ====================================================

        elapsed = (
            time.time()
            - start_time
        )

        result["time"] = round(
            elapsed,
            2
        )

        print()
        print("========================================")
        print("Train loading completed")
        print("========================================")

        print(
            f"Total records: "
            f"{result['loaded']}"
        )

        print(
            f"New trains inserted: "
            f"{result['inserted']}"
        )

        print(
            f"Existing trains skipped: "
            f"{result['skipped']}"
        )

        print(
            f"Duplicate IDs: "
            f"{result['duplicate_ids']}"
        )

        print(
            f"Duplicate train numbers: "
            f"{result['duplicate_train_numbers']}"
        )

        print(
            f"Missing stations created: "
            f"{result['missing_stations_created']}"
        )

        print(
            f"Errors: "
            f"{result['errors']}"
        )

        print(
            f"Time: "
            f"{result['time']} seconds"
        )

        return result

    except Exception as error:

        db.rollback()

        logger.exception(
            f"Train loading failed: {error}"
        )

        print()
        print(
            f"Train loading failed: {error}"
        )

        result["errors"] += 1

        result["time"] = round(
            time.time()
            - start_time,
            2
        )

        return result