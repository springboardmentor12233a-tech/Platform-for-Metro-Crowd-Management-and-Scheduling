from __future__ import annotations

import re
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

DATASET_NAME = "entry_exit"
RAW_PATH = RAW_DIR / "entry-exit.xls"
OUT_FILE = "entry_exit_preprocessed.csv"


def _load_entry_exit_workbook() -> pd.DataFrame:
    try:
        workbook = pd.ExcelFile(RAW_PATH, engine="xlrd")
    except ImportError as exc:
        raise RuntimeError(
            "entry-exit.xls is a legacy Excel workbook and requires optional dependency 'xlrd>=2.0.1'."
        ) from exc

    frames = []
    for sheet in workbook.sheet_names:
        if not re.search(r"\d{4}", sheet):
            continue
        frame = workbook.parse(sheet, header=6).dropna(how="all")
        match = re.search(r"(\d{4})", sheet)
        frame["source_sheet"] = sheet
        frame["year"] = int(match.group(1)) if match else pd.NA
        frames.append(frame)
    if not frames:
        raise ValueError("No yearly sheets found in entry-exit.xls")
    return pd.concat(frames, ignore_index=True)


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    try:
        df = _load_entry_exit_workbook()
    except Exception as exc:
        log_record["errors"].append(str(exc))
        logger.error("%s", exc)
        flush_log(DATASET_NAME, log_record, logger)
        raise
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = df.rename(
        columns={
            "nlc": "station_nlc",
            "entry_exit_million": "entry_exit_million",
            "entry_exit_millions": "entry_exit_million",
        }
    )
    df = remove_duplicates(df, log_record)

    numeric_cols = [
        col
        for col in df.columns
        if col in {"station_nlc", "year"} or any(token in col for token in ["entry", "exit", "weekday", "saturday", "sunday", "million"])
    ]
    df = convert_numeric(df, numeric_cols, log_record)
    station_cols = [col for col in df.columns if "station" in col and col != "station_nlc"]
    category_cols = station_cols + [col for col in ["borough", "note", "source_sheet"] if col in df.columns]
    df = standardize_categories(df, category_cols)
    df = handle_missing_values(
        df,
        log_record,
        {
            "station_nlc": "drop_row",
            "year": "drop_row",
            **{col: "drop_row" for col in station_cols[:1]},
            **{col: "unknown" for col in ["borough", "note"] if col in df.columns},
        },
    )

    before = len(df)
    if "year" in df.columns:
        df = df.loc[df["year"].between(2000, 2030)].reset_index(drop=True)
    log_record["invalid_rows_removed"] += int(before - len(df))

    weekday_entry = next((col for col in df.columns if "weekday" in col and "entry" in col), None)
    weekday_exit = next((col for col in df.columns if "weekday" in col and "exit" in col), None)
    if weekday_entry and weekday_exit:
        df["weekday_net_flow"] = df[weekday_entry] - df[weekday_exit]
    if "entry_exit_million" in df.columns:
        df["entry_exit_annual"] = df["entry_exit_million"] * 1_000_000
    df = detect_outliers(df, [col for col in numeric_cols if col in df.columns], log_record)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()
