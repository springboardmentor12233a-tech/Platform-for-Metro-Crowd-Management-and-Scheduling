import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Delay
from app.models.enums import (
    Season,
    TransportType,
    WeatherCondition,
    Weekday,
)

from .config import CHUNK_SIZE, DELAY_CSV
from .logger import logger
from .mapper import Mapper
from .utils import chunked_iterable
from .validators import (
    clean_bool,
    clean_float,
    clean_int,
    clean_string,
    parse_date,
    parse_time,
)


# ============================================================
# ENUM MAPPINGS
# ============================================================

TRANSPORT_TYPE_MAP = {
    "METRO": TransportType.METRO,
    "BUS": TransportType.BUS,
    "TRAIN": TransportType.TRAIN,
    "TRAM": TransportType.TRAM,
}


WEATHER_CONDITION_MAP = {
    "CLEAR": WeatherCondition.SUNNY,
    "SUNNY": WeatherCondition.SUNNY,
    "CLOUDY": WeatherCondition.CLOUDY,
    "RAIN": WeatherCondition.RAINY,
    "RAINY": WeatherCondition.RAINY,
    "STORM": WeatherCondition.STORM,
    "FOG": WeatherCondition.FOG,
    "SNOW": WeatherCondition.SNOW,
}


WEEKDAY_MAP = {
    "0": Weekday.MONDAY,
    "1": Weekday.TUESDAY,
    "2": Weekday.WEDNESDAY,
    "3": Weekday.THURSDAY,
    "4": Weekday.FRIDAY,
    "5": Weekday.SATURDAY,
    "6": Weekday.SUNDAY,
}


SEASON_MAP = {
    "SPRING": Season.SPRING,
    "SUMMER": Season.SUMMER,
    "MONSOON": Season.MONSOON,
    "AUTUMN": Season.AUTUMN,
    "WINTER": Season.WINTER,
}


# ============================================================
# ENUM NORMALIZATION HELPERS
# ============================================================

def normalize_transport_type(value):
    if value is None or pd.isna(value):
        return None

    value = str(value).strip().upper()

    return TRANSPORT_TYPE_MAP.get(value)


def normalize_weather_condition(value):
    if value is None or pd.isna(value):
        return None

    value = str(value).strip().upper()

    return WEATHER_CONDITION_MAP.get(value)


def normalize_weekday(value):
    if value is None or pd.isna(value):
        return None

    value = str(value).strip()

    return WEEKDAY_MAP.get(value)


def normalize_season(value):
    if value is None or pd.isna(value):
        return None

    value = str(value).strip().upper()

    return SEASON_MAP.get(value)


# ============================================================
# LOAD DELAYS
# ============================================================

def load_delays(db: Session, mapper: Mapper) -> dict:

    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    t0 = time.time()

    logger.info(f"Loading {DELAY_CSV.name}...")

    try:

        # ----------------------------------------------------
        # CHECK FILE
        # ----------------------------------------------------

        if not DELAY_CSV.exists():

            logger.error(
                f"File not found: {DELAY_CSV}"
            )

            stats["errors"] += 1

            return stats

        # ----------------------------------------------------
        # READ CSV
        # ----------------------------------------------------

        df = pd.read_csv(DELAY_CSV)

        stats["loaded"] = len(df)

        logger.info(
            f"Delay records found: {len(df)}"
        )

        # ----------------------------------------------------
        # REQUIRED COLUMNS
        # ----------------------------------------------------

        required_columns = [
            "id",
            "route_id",
            "origin_station",
            "destination_station",
            "date",
            "time",
            "transport_type",
            "scheduled_departure",
            "scheduled_arrival",
            "actual_departure_delay_min",
            "actual_arrival_delay_min",
            "weather_condition",
            "temperature_c",
            "humidity_percent",
            "wind_speed_kmh",
            "precipitation_mm",
            "event_type",
            "event_attendance_est",
            "traffic_congestion_index",
            "holiday",
            "peak_hour",
            "weekday",
            "season",
            "delayed",
            "time_min",
            "scheduled_departure_min",
            "scheduled_arrival_min",
            "is_delayed_5min",
            "year",
            "month",
            "day_of_week",
            "is_weekend",
            "actual_departure_delay_min_outlier",
            "actual_arrival_delay_min_outlier",
            "event_attendance_est_outlier",
            "traffic_congestion_index_outlier",
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

            stats["errors"] += 1

            return stats

        # ----------------------------------------------------
        # PREPARE RECORDS
        # ----------------------------------------------------

        valid_dicts = []

        seen_ids = set()

        for _, row in df.iterrows():

            try:

                # --------------------------------------------
                # ID
                # --------------------------------------------

                record_id = clean_string(
                    row.get("id")
                )

                if not record_id:

                    stats["skipped"] += 1
                    continue

                if record_id in seen_ids:

                    stats["skipped"] += 1
                    continue

                seen_ids.add(record_id)

                # --------------------------------------------
                # ROUTE
                # --------------------------------------------

                route_id = clean_string(
                    row.get("route_id")
                )

                if not route_id:

                    stats["skipped"] += 1
                    continue

                # --------------------------------------------
                # STATIONS
                # --------------------------------------------

                origin_name = clean_string(
                    row.get("origin_station")
                )

                destination_name = clean_string(
                    row.get("destination_station")
                )

                if not origin_name or not destination_name:

                    stats["skipped"] += 1
                    continue

                origin_station_id = (
                    mapper.get_or_create_station(
                        origin_name
                    )
                )

                destination_station_id = (
                    mapper.get_or_create_station(
                        destination_name
                    )
                )

                if (
                    origin_station_id is None
                    or destination_station_id is None
                ):

                    logger.warning(
                        f"Station mapping failed for "
                        f"{record_id}: "
                        f"{origin_name} -> "
                        f"{destination_name}"
                    )

                    stats["skipped"] += 1
                    continue

                # --------------------------------------------
                # ENUM VALUES
                # --------------------------------------------

                transport_type = normalize_transport_type(
                    row.get("transport_type")
                )

                weather_condition = normalize_weather_condition(
                    row.get("weather_condition")
                )

                weekday = normalize_weekday(
                    row.get("weekday")
                )

                season = normalize_season(
                    row.get("season")
                )

                # --------------------------------------------
                # VALIDATE ENUM MAPPINGS
                # --------------------------------------------

                if transport_type is None:

                    logger.warning(
                        f"Invalid transport type for "
                        f"{record_id}: "
                        f"{row.get('transport_type')}"
                    )

                    stats["skipped"] += 1
                    continue

                if weather_condition is None:

                    logger.warning(
                        f"Invalid weather condition for "
                        f"{record_id}: "
                        f"{row.get('weather_condition')}"
                    )

                    stats["skipped"] += 1
                    continue

                if weekday is None:

                    logger.warning(
                        f"Invalid weekday for "
                        f"{record_id}: "
                        f"{row.get('weekday')}"
                    )

                    stats["skipped"] += 1
                    continue

                if season is None:

                    logger.warning(
                        f"Invalid season for "
                        f"{record_id}: "
                        f"{row.get('season')}"
                    )

                    stats["skipped"] += 1
                    continue

                # --------------------------------------------
                # CREATE RECORD
                # --------------------------------------------

                record = {
                    "id": record_id,

                    # No matching Train ID exists in this
                    # dataset. Therefore keep train_id NULL.
                    "train_id": None,

                    # Preserve Route_1 ... Route_20.
                    "route_id": route_id,

                    "origin_station_id": origin_station_id,

                    "destination_station_id": (
                        destination_station_id
                    ),

                    "date": parse_date(
                        row.get("date")
                    ),

                    "time": parse_time(
                        row.get("time")
                    ),

                    "transport_type": transport_type,

                    "scheduled_departure": parse_time(
                        row.get("scheduled_departure")
                    ),

                    "scheduled_arrival": parse_time(
                        row.get("scheduled_arrival")
                    ),

                    "actual_departure_delay_min": clean_float(
                        row.get(
                            "actual_departure_delay_min"
                        )
                    ),

                    "actual_arrival_delay_min": clean_float(
                        row.get(
                            "actual_arrival_delay_min"
                        )
                    ),

                    "weather_condition": weather_condition,

                    "temperature_c": clean_float(
                        row.get("temperature_c")
                    ),

                    "humidity_percent": clean_float(
                        row.get("humidity_percent")
                    ),

                    "wind_speed_kmh": clean_float(
                        row.get("wind_speed_kmh")
                    ),

                    "precipitation_mm": clean_float(
                        row.get("precipitation_mm")
                    ),

                    "event_type": clean_string(
                        row.get("event_type")
                    ),

                    "event_attendance_est": clean_int(
                        row.get("event_attendance_est")
                    ),

                    "traffic_congestion_index": clean_float(
                        row.get(
                            "traffic_congestion_index"
                        )
                    ),

                    "holiday": clean_bool(
                        row.get("holiday")
                    ),

                    "peak_hour": clean_bool(
                        row.get("peak_hour")
                    ),

                    "weekday": weekday,

                    "season": season,

                    "delayed": clean_bool(
                        row.get("delayed")
                    ),

                    "time_min": clean_int(
                        row.get("time_min")
                    ),

                    "scheduled_departure_min": clean_int(
                        row.get(
                            "scheduled_departure_min"
                        )
                    ),

                    "scheduled_arrival_min": clean_int(
                        row.get(
                            "scheduled_arrival_min"
                        )
                    ),

                    "is_delayed_5min": clean_bool(
                        row.get("is_delayed_5min")
                    ),

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

                    "actual_departure_delay_min_outlier": (
                        clean_bool(
                            row.get(
                                "actual_departure_delay_min_outlier"
                            )
                        )
                    ),

                    "actual_arrival_delay_min_outlier": (
                        clean_bool(
                            row.get(
                                "actual_arrival_delay_min_outlier"
                            )
                        )
                    ),

                    "event_attendance_est_outlier": (
                        clean_bool(
                            row.get(
                                "event_attendance_est_outlier"
                            )
                        )
                    ),

                    "traffic_congestion_index_outlier": (
                        clean_bool(
                            row.get(
                                "traffic_congestion_index_outlier"
                            )
                        )
                    ),
                }

                valid_dicts.append(record)

            except Exception as row_error:

                logger.warning(
                    f"Skipping delay record "
                    f"{row.get('id', 'UNKNOWN')}: "
                    f"{row_error}"
                )

                stats["skipped"] += 1

        # ----------------------------------------------------
        # INSERT IN BATCHES
        # ----------------------------------------------------

        logger.info(
            f"Prepared {len(valid_dicts)} valid delay records"
        )
        
        # Commit any newly mapped stations so a batch rollback doesn't delete them
        try:
            db.commit()
        except Exception:
            db.rollback()

        for chunk in chunked_iterable(
            valid_dicts,
            CHUNK_SIZE
        ):

            try:

                stmt = (
                    insert(Delay)
                    .values(chunk)
                    .on_conflict_do_nothing(
                        index_elements=[Delay.id]
                    )
                    .returning(Delay.id)
                )

                result = db.execute(stmt)
                db.commit()

                batch_inserted = len(result.fetchall())
                stats["inserted"] += batch_inserted
                
                batch_skipped = len(chunk) - batch_inserted
                if batch_skipped > 0:
                    stats["skipped"] += batch_skipped

                logger.info(
                    f"Inserted delay batch: "
                    f"{stats['inserted']} total inserted"
                )

            except Exception as batch_error:

                logger.error(
                    f"Delay batch failed: "
                    f"{batch_error}",
                    exc_info=True,
                )

                db.rollback()

                # ----------------------------------------------------
                # FALLBACK: RECORD-BY-RECORD
                # ----------------------------------------------------
                for record in chunk:
                    try:
                        stmt = (
                            insert(Delay)
                            .values(record)
                            .on_conflict_do_nothing(
                                index_elements=[Delay.id]
                            )
                            .returning(Delay.id)
                        )
                        
                        result = db.execute(stmt)
                        db.commit()
                        
                        if result.fetchone():
                            stats["inserted"] += 1
                        else:
                            stats["skipped"] += 1
                            
                    except Exception as record_error:
                        db.rollback()
                        logger.warning(
                            f"Skipping delay record {record['id']}: {record_error}"
                        )
                        stats["skipped"] += 1

        # ----------------------------------------------------
        # FINAL LOGGING
        # ----------------------------------------------------

        logger.info(
            "========================================"
        )

        logger.info(
            "Delay loading completed"
        )

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

        logger.info(
            "========================================"
        )

    except Exception as e:

        logger.error(
            f"Error loading delays: {e}",
            exc_info=True,
        )

        stats["errors"] += 1

        db.rollback()

    stats["time"] = round(
        time.time() - t0,
        2
    )

    return stats