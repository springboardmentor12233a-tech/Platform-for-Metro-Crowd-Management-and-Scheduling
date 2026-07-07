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
)

DATASET_NAME = "sensor"
RAW_PATH = RAW_DIR / "metro-sensordata.csv"
OUT_FILE = "sensor_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_csv(RAW_PATH, low_memory=False)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    if "unnamed_0" in df.columns:
        df = df.rename(columns={"unnamed_0": "source_row_id"})
    df = remove_duplicates(df, log_record, subset=["timestamp", "source_row_id"] if "source_row_id" in df.columns else ["timestamp"])
    df = convert_datetime(df, ["timestamp"], log_record)
    numeric_cols = [col for col in df.columns if col != "timestamp"]
    df = convert_numeric(df, numeric_cols, log_record)
    strategies = {col: "median" for col in numeric_cols}
    strategies["timestamp"] = "drop_row"
    df = handle_missing_values(df, log_record, strategies)

    before = len(df)
    df = df.loc[df["timestamp"].notna()].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))

    df = detect_outliers(
        df,
        [col for col in numeric_cols if col not in {"source_row_id", "comp", "dv_eletric", "towers", "mpg", "lps", "pressure_switch", "oil_level", "caudal_impulses"}],
        log_record,
    )
    df["year"] = df["timestamp"].dt.year
    df["month"] = df["timestamp"].dt.month
    df["day"] = df["timestamp"].dt.day
    df["hour"] = df["timestamp"].dt.hour
    df = df.sort_values("timestamp").reset_index(drop=True)
    df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S")

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()
