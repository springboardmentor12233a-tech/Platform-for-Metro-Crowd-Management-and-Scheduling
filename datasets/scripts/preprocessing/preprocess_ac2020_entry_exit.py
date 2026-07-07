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
    standardize_categories,
)

DATASET_NAME = "ac2020_entry_exit"
RAW_PATH = RAW_DIR / "AC2020_AnnualisedEntryExit.xlsx"
OUT_FILE = "ac2020_entry_exit_preprocessed.csv"


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    df = pd.read_excel(RAW_PATH, sheet_name="Annualised", header=6, engine="openpyxl")
    df = df.dropna(how="all")
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = df.rename(columns={"annualised_en_ex": "annualised_entry_exit"})
    df = remove_duplicates(df, log_record, subset=["nlc", "station"] if {"nlc", "station"}.issubset(df.columns) else None)
    numeric_cols = [
        "nlc",
        "weekday_mon_thu_entries",
        "friday_entries",
        "saturday_entries",
        "sunday_entries",
        "weekday_mon_thu_exits",
        "friday_exits",
        "saturday_exits",
        "sunday_exits",
        "annualised_entry_exit",
    ]
    df = convert_numeric(df, numeric_cols, log_record)
    df = standardize_categories(df, ["mode", "asc", "station", "coverage", "source"])
    df = handle_missing_values(
        df,
        log_record,
        {
            "mode": "unknown",
            "nlc": "drop_row",
            "station": "drop_row",
            "coverage": "unknown",
            "source": "unknown",
            **{col: "median" for col in numeric_cols if col not in {"nlc"}},
        },
    )
    before = len(df)
    if "annualised_entry_exit" in df.columns:
        df = df.loc[df["annualised_entry_exit"].ge(0)].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))
    if {"weekday_mon_thu_entries", "weekday_mon_thu_exits"}.issubset(df.columns):
        df["weekday_net_flow"] = df["weekday_mon_thu_entries"] - df["weekday_mon_thu_exits"]
    df["data_year"] = 2020
    df = detect_outliers(df, [col for col in numeric_cols if col in df.columns], log_record)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

