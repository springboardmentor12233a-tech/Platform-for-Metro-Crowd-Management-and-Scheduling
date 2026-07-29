import time

import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Delay

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
        if not DELAY_CSV.exists():
            logger.error(f"File not found: {DELAY_CSV}")
            stats["errors"] += 1
            return stats

        df = pd.read_csv(DELAY_CSV)

        stats["loaded"] = len(df)

        valid_dicts = []

        for _, row in df.iterrows():

            record_id = clean_string(row.get("id"))

            if not record_id:
                stats["skipped"] += 1
                continue

            origin_station = mapper.get_or_create_station(
                clean_string(row.get("origin_station"))
            )

            destination_station = mapper.get_or_create_station(
                clean_string(row.get("destination_station"))
            )

            valid_dicts.append(
                {
                    "id": record_id,
                    "train_id": clean_string(row.get("route_id")),
                    "origin_station_id": origin_station,
                    "destination_station_id": destination_station,
                    "date": parse_date(row.get("date")),
                    "time": parse_time(row.get("time")),
                    "transport_type": clean_string(row.get("transport_type")),
                    "scheduled_departure": parse_time(row.get("scheduled_departure")),
                    "scheduled_arrival": parse_time(row.get("scheduled_arrival")),
                    "actual_departure_delay_min": clean_float(row.get("actual_departure_delay_min")),
                    "actual_arrival_delay_min": clean_float(row.get("actual_arrival_delay_min")),
                    "weather_condition": clean_string(row.get("weather_condition")),
                    "temperature_c": clean_float(row.get("temperature_c")),
                    "humidity_percent": clean_float(row.get("humidity_percent")),
                    "wind_speed_kmh": clean_float(row.get("wind_speed_kmh")),
                    "precipitation_mm": clean_float(row.get("precipitation_mm")),
                    "event_type": clean_string(row.get("event_type")),
                    "event_attendance_est": clean_int(row.get("event_attendance_est")),
                    "traffic_congestion_index": clean_float(row.get("traffic_congestion_index")),
                    "holiday": clean_bool(row.get("holiday")),
                    "peak_hour": clean_bool(row.get("peak_hour")),
                    "weekday": clean_string(row.get("weekday")),
                    "season": clean_string(row.get("season")),
                    "delayed": clean_bool(row.get("delayed")),
                    "time_min": clean_int(row.get("time_min")),
                    "scheduled_departure_min": clean_int(row.get("scheduled_departure_min")),
                    "scheduled_arrival_min": clean_int(row.get("scheduled_arrival_min")),
                    "is_delayed_5min": clean_bool(row.get("is_delayed_5min")),
                    "year": clean_int(row.get("year")),
                    "month": clean_int(row.get("month")),
                    "day_of_week": clean_string(row.get("day_of_week")),
                    "is_weekend": clean_bool(row.get("is_weekend")),
                    "actual_departure_delay_min_outlier": clean_bool(
                        row.get("actual_departure_delay_min_outlier")
                    ),
                    "actual_arrival_delay_min_outlier": clean_bool(
                        row.get("actual_arrival_delay_min_outlier")
                    ),
                    "event_attendance_est_outlier": clean_bool(
                        row.get("event_attendance_est_outlier")
                    ),
                    "traffic_congestion_index_outlier": clean_bool(
                        row.get("traffic_congestion_index_outlier")
                    ),
                }
            )

        if valid_dicts:

            for chunk in chunked_iterable(valid_dicts, CHUNK_SIZE):

                stmt = (
                    insert(Delay)
                    .values(chunk)
                    .on_conflict_do_nothing()
                )

                db.execute(stmt)
                stats["inserted"] += len(chunk)

            db.commit()

    except Exception as e:
        logger.error(
            f"Error loading delays: {e}",
            exc_info=True,
        )

        stats["errors"] += 1
        db.rollback()

    stats["time"] = round(time.time() - t0, 2)

    return stats