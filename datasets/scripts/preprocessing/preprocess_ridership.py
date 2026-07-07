from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))

from preprocess_common import (
    RAW_DIR,
    build_logger,
    clean_column_names,
    convert_numeric,
    detect_outliers,
    flush_log,
    handle_missing_values,
    record_input,
    remove_duplicates,
    save_clean_dataset,
)

DATASET_NAME = "ridership"
RAW_PATH = RAW_DIR / "ridership.csv"
OUT_FILE = "ridership_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_csv(RAW_PATH, low_memory=False)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["_id"])
    if "year" in df.columns:
        df["year_label"] = df["year"].astype("string").str.replace("*", "", regex=False).str.strip()
        df["start_year"] = pd.to_numeric(df["year_label"].str.extract(r"^(\d{4})")[0], errors="coerce")
        log_record["columns_converted"].append("year:start_year")
    df = convert_numeric(df, ["ridership", "operational_route_km", "rolling_stock_num_cars"], log_record)
    df = handle_missing_values(
        df,
        log_record,
        {
            "ridership": "median",
            "operational_route_km": "median",
            "rolling_stock_num_cars": "median",
            "start_year": "drop_row",
        },
    )
    df = detect_outliers(df, ["ridership", "operational_route_km", "rolling_stock_num_cars"], log_record)
    df = df.sort_values("start_year").reset_index(drop=True)
    df["ridership_yoy_growth_pct"] = df["ridership"].pct_change().mul(100).round(3)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

