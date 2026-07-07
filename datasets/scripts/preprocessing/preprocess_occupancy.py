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
    record_input,
    remove_duplicates,
    save_clean_dataset,
    standardize_categories,
    validate_coordinates,
)

DATASET_NAME = "occupancy"
RAW_PATH = RAW_DIR / "train-occupancy.csv"
OUT_FILE = "occupancy_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_csv(RAW_PATH, low_memory=False)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["station_id"])
    df = convert_numeric(df, ["station_id", "distance_from_start_km", "latitude", "longitude"], log_record)
    df = convert_datetime(df, ["opening_date"], log_record)
    df = standardize_categories(df, ["station_name", "line", "station_layout"])
    df = handle_missing_values(
        df,
        log_record,
        {
            "station_name": "drop_row",
            "line": "unknown",
            "station_layout": "unknown",
            "distance_from_start_km": "median",
            "opening_date": "drop_row",
        },
    )
    df = validate_coordinates(df, "latitude", "longitude", log_record, region="india", action="flag")
    df = detect_outliers(df, ["distance_from_start_km"], log_record)
    df["opening_year"] = df["opening_date"].dt.year
    df["opening_date"] = df["opening_date"].dt.strftime("%Y-%m-%d")

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

