from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
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
)

DATASET_NAME = "ticketing"
RAW_PATH = RAW_DIR / "ticketing.csv"
OUT_FILE = "ticketing_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_csv(RAW_PATH, low_memory=False)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["tripid"])
    df = convert_datetime(df, ["date"], log_record)
    df = convert_numeric(df, ["distance_km", "fare", "cost_per_passenger", "passengers"], log_record)
    df = standardize_categories(df, ["from_station", "to_station", "ticket_type", "remarks"])
    df = handle_missing_values(
        df,
        log_record,
        {
            "ticket_type": "mode",
            "passengers": "median",
            "remarks": "unknown",
        },
    )

    before = len(df)
    valid = (
        df["date"].notna()
        & df["distance_km"].between(0.1, 100)
        & df["fare"].between(1, 500)
        & df["passengers"].between(1, 100)
    )
    df = df.loc[valid].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))

    df["passengers"] = df["passengers"].round().astype("int64")
    df["fare_per_km"] = (df["fare"] / df["distance_km"].replace(0, np.nan)).round(4)
    df["total_revenue"] = (df["fare"] * df["passengers"]).round(2)
    df["cost_exceeds_fare"] = (df["cost_per_passenger"] > df["fare"]).astype("int8")
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype("int8")
    df["od_pair"] = df["from_station"].astype("string") + " -> " + df["to_station"].astype("string")

    df = detect_outliers(df, ["distance_km", "fare", "cost_per_passenger", "passengers"], log_record)
    df = df.sort_values(["date", "tripid"]).reset_index(drop=True)
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()
