from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
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
    parse_time_to_minutes,
    record_input,
    remove_duplicates,
    save_clean_dataset,
    standardize_categories,
)

DATASET_NAME = "schedules"
RAW_PATH = RAW_DIR / "schedules.json"
OUT_FILE = "schedules_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    with RAW_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)
    df = pd.DataFrame(data)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["id"])
    df = convert_numeric(df, ["id", "day"], log_record, downcast="integer")
    df = standardize_categories(df, ["train_name", "station_name", "station_code"], case="upper")

    for col in ["arrival", "departure"]:
        if col in df.columns:
            df[col] = df[col].replace({"None": pd.NA, "": pd.NA})
            df[f"{col}_min"] = parse_time_to_minutes(df[col])
            df[f"is_{col}_missing"] = df[col].isna().astype("int8")
            log_record["columns_converted"].append(f"{col}:time_minutes")

    df = handle_missing_values(
        df,
        log_record,
        {
            "id": "drop_row",
            "train_number": "drop_row",
            "station_name": "drop_row",
            "station_code": "drop_row",
            "day": "median",
        },
    )

    before = len(df)
    valid_day = df["day"].between(1, 13)
    has_stop_time = df["arrival_min"].notna() | df["departure_min"].notna()
    df = df.loc[valid_day & has_stop_time].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))

    df["day"] = df["day"].round().astype("int16")
    df["departure_hour"] = np.floor(df["departure_min"] / 60).astype("Int16")
    df["arrival_hour"] = np.floor(df["arrival_min"] / 60).astype("Int16")
    df["is_peak_departure"] = df["departure_hour"].isin([7, 8, 9, 17, 18, 19]).astype("int8")
    df["is_origin_stop"] = df["arrival"].isna().astype("int8")
    df["is_terminus_stop"] = df["departure"].isna().astype("int8")
    df["stop_sequence"] = df.groupby("train_number").cumcount() + 1
    df["dwell_min"] = df["departure_min"] - df["arrival_min"]
    invalid_dwell = (df["dwell_min"] < 0) | (df["dwell_min"] > 120)
    df.loc[invalid_dwell, "dwell_min"] = np.nan
    log_record["warnings"].append(f"{int(invalid_dwell.sum())} invalid dwell_min values nullified")
    df = detect_outliers(df, ["stop_sequence", "dwell_min"], log_record)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

