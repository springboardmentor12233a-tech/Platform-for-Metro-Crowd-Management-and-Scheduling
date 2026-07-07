from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))

from preprocess_common import (
    RAW_DIR,
    build_logger,
    clean_column_names,
    convert_datetime,
    convert_numeric,
    detect_outliers,
    flush_log,
    handle_missing_values,
    parse_time_to_minutes,
    record_input,
    remove_duplicates,
    save_clean_dataset,
    standardize_categories,
)

DATASET_NAME = "delay"
RAW_PATH = RAW_DIR / "delay.csv"
OUT_FILE = "delay_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_csv(RAW_PATH, low_memory=False)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["trip_id"])
    df = convert_datetime(df, ["date"], log_record)
    numeric_cols = [
        "actual_departure_delay_min",
        "actual_arrival_delay_min",
        "temperature_c",
        "humidity_percent",
        "wind_speed_kmh",
        "precipitation_mm",
        "event_attendance_est",
        "traffic_congestion_index",
        "holiday",
        "peak_hour",
        "weekday",
        "delayed",
    ]
    df = convert_numeric(df, numeric_cols, log_record)
    for col in ["time", "scheduled_departure", "scheduled_arrival"]:
        if col in df.columns:
            df[f"{col}_min"] = parse_time_to_minutes(df[col])
            log_record["columns_converted"].append(f"{col}:time_minutes")

    df = standardize_categories(
        df,
        ["transport_type", "route_id", "origin_station", "destination_station", "weather_condition", "event_type", "season"],
    )
    df = handle_missing_values(
        df,
        log_record,
        {
            "date": "drop_row",
            "actual_departure_delay_min": "median",
            "actual_arrival_delay_min": "median",
            "weather_condition": "unknown",
            "event_type": "unknown",
            "season": "unknown",
            "temperature_c": "median",
            "humidity_percent": "median",
            "wind_speed_kmh": "median",
            "precipitation_mm": "zero",
            "event_attendance_est": "zero",
            "traffic_congestion_index": "median",
        },
    )

    before = len(df)
    valid = (
        df["actual_departure_delay_min"].between(-60, 240)
        & df["actual_arrival_delay_min"].between(-60, 240)
        & df["humidity_percent"].between(0, 100)
        & df["traffic_congestion_index"].between(0, 100)
    )
    df = df.loc[valid].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))

    df["is_delayed_5min"] = (
        (df["actual_departure_delay_min"] > 5) | (df["actual_arrival_delay_min"] > 5)
    ).astype("int8")
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype("int8")
    df = detect_outliers(
        df,
        ["actual_departure_delay_min", "actual_arrival_delay_min", "event_attendance_est", "traffic_congestion_index"],
        log_record,
    )
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

