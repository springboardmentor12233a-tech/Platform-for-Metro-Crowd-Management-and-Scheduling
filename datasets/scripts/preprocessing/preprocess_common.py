"""Shared preprocessing utilities for the metro data platform.

The functions in this module are intentionally small and composable. Dataset
scripts are responsible for domain rules; this module handles repeatable data
quality operations, logging, and safe output.
"""

from __future__ import annotations

import json
import logging
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "raw"
PROCESSED_DIR = ROOT / "processed"
LOGS_DIR = ROOT / "logs"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)


def build_logger(dataset_name: str) -> tuple[logging.Logger, dict[str, Any]]:
    """Create a per-dataset file logger and a structured summary record."""
    logger = logging.getLogger(f"preprocess.{dataset_name}")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    logger.propagate = False

    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    file_handler = logging.FileHandler(LOGS_DIR / f"{dataset_name}.log", mode="w", encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    log_record: dict[str, Any] = {
        "dataset": dataset_name,
        "run_started": datetime.now().isoformat(timespec="seconds"),
        "input_rows": 0,
        "input_cols": 0,
        "output_rows": 0,
        "output_cols": 0,
        "duplicates_removed": 0,
        "missing_values_handled": {},
        "invalid_rows_removed": 0,
        "columns_converted": [],
        "outliers_detected": {},
        "output_filename": None,
        "warnings": [],
        "errors": [],
    }
    return logger, log_record


def flush_log(dataset_name: str, log_record: dict[str, Any], logger: logging.Logger) -> None:
    """Persist the structured preprocessing summary as JSON."""
    log_record["run_finished"] = datetime.now().isoformat(timespec="seconds")
    path = LOGS_DIR / f"{dataset_name}_summary.json"
    path.write_text(json.dumps(log_record, indent=2, default=str), encoding="utf-8")
    logger.info("summary_log=%s", path)


def record_input(df: pd.DataFrame, log_record: dict[str, Any]) -> None:
    log_record["input_rows"] = int(len(df))
    log_record["input_cols"] = int(df.shape[1])


def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names to unique snake_case labels."""
    def normalize(name: Any) -> str:
        text = str(name).strip().lower()
        text = re.sub(r"[\s\-/().\[\]{}]+", "_", text)
        text = re.sub(r"[^a-z0-9_]", "", text)
        text = re.sub(r"_+", "_", text).strip("_")
        return text or "column"

    seen: dict[str, int] = {}
    columns: list[str] = []
    for raw_col in df.columns:
        col = normalize(raw_col)
        if col in seen:
            seen[col] += 1
            col = f"{col}_{seen[col]}"
        else:
            seen[col] = 0
        columns.append(col)

    df = df.copy()
    df.columns = columns
    return df


def remove_duplicates(
    df: pd.DataFrame,
    log_record: dict[str, Any],
    subset: list[str] | None = None,
    keep: str = "first",
) -> pd.DataFrame:
    """Drop exact or key-based duplicates and record the removed count."""
    before = len(df)
    existing_subset = [col for col in subset or [] if col in df.columns] or None
    df = df.drop_duplicates(subset=existing_subset, keep=keep).reset_index(drop=True)
    log_record["duplicates_removed"] += int(before - len(df))
    return df


def handle_missing_values(
    df: pd.DataFrame,
    log_record: dict[str, Any],
    strategies: dict[str, str | int | float] | None = None,
) -> pd.DataFrame:
    """Apply missing-value strategies by column.

    Supported string strategies: median, mean, mode, unknown, zero, ffill,
    bfill, drop_row, drop_col. Non-string values are used as constants.
    """
    df = df.copy()
    strategies = strategies or {}
    handled: dict[str, str] = {}

    for col, strategy in strategies.items():
        if col not in df.columns:
            continue
        missing = int(df[col].isna().sum())
        if missing == 0:
            continue

        if strategy == "median":
            value = pd.to_numeric(df[col], errors="coerce").median()
            df[col] = df[col].fillna(value)
            action = f"filled {missing} with median"
        elif strategy == "mean":
            value = pd.to_numeric(df[col], errors="coerce").mean()
            df[col] = df[col].fillna(value)
            action = f"filled {missing} with mean"
        elif strategy == "mode":
            modes = df[col].mode(dropna=True)
            value = modes.iloc[0] if not modes.empty else "Unknown"
            df[col] = df[col].fillna(value)
            action = f"filled {missing} with mode"
        elif strategy == "unknown":
            df[col] = df[col].fillna("Unknown")
            action = f"filled {missing} with Unknown"
        elif strategy == "zero":
            df[col] = df[col].fillna(0)
            action = f"filled {missing} with 0"
        elif strategy == "ffill":
            df[col] = df[col].ffill()
            action = f"forward-filled {missing}"
        elif strategy == "bfill":
            df[col] = df[col].bfill()
            action = f"back-filled {missing}"
        elif strategy == "drop_row":
            before = len(df)
            df = df.dropna(subset=[col]).reset_index(drop=True)
            action = f"dropped {before - len(df)} rows"
        elif strategy == "drop_col":
            df = df.drop(columns=[col])
            action = f"dropped column with {missing} missing"
        else:
            df[col] = df[col].fillna(strategy)
            action = f"filled {missing} with constant"

        handled[col] = action

    log_record["missing_values_handled"].update(handled)
    return df


def convert_datetime(
    df: pd.DataFrame,
    columns: list[str],
    log_record: dict[str, Any],
    date_format: str | None = None,
) -> pd.DataFrame:
    """Convert columns to pandas datetime with invalid values coerced to NaT."""
    df = df.copy()
    for col in columns:
        if col not in df.columns:
            continue
        df[col] = pd.to_datetime(df[col], format=date_format, errors="coerce")
        log_record["columns_converted"].append(f"{col}:datetime")
    return df


def convert_numeric(
    df: pd.DataFrame,
    columns: list[str],
    log_record: dict[str, Any],
    downcast: str | None = None,
) -> pd.DataFrame:
    """Convert comma/currency-decorated string columns to numeric dtype."""
    df = df.copy()
    for col in columns:
        if col not in df.columns:
            continue
        cleaned = (
            df[col]
            .astype("string")
            .str.replace(",", "", regex=False)
            .str.replace(r"[^\d.\-]", "", regex=True)
            .replace("", pd.NA)
        )
        df[col] = pd.to_numeric(cleaned, errors="coerce", downcast=downcast)
        log_record["columns_converted"].append(f"{col}:numeric")
    return df


def standardize_categories(
    df: pd.DataFrame,
    columns: list[str],
    case: str = "title",
    aliases: dict[str, str] | None = None,
) -> pd.DataFrame:
    """Strip and case-normalize categorical string columns."""
    df = df.copy()
    aliases = aliases or {}
    for col in columns:
        if col not in df.columns:
            continue
        original_na = df[col].isna()
        values = df[col].astype("string").str.strip()
        if case == "title":
            values = values.str.title()
        elif case == "upper":
            values = values.str.upper()
        elif case == "lower":
            values = values.str.lower()
        values = values.replace(aliases)
        df[col] = values.mask(original_na, pd.NA)
    return df


def detect_outliers(
    df: pd.DataFrame,
    columns: list[str],
    log_record: dict[str, Any],
    method: str = "iqr",
    action: str = "flag",
    iqr_multiplier: float = 1.5,
    z_threshold: float = 3.0,
) -> pd.DataFrame:
    """Detect numeric outliers and either flag, cap, or remove rows."""
    df = df.copy()
    combined_remove = pd.Series(False, index=df.index)

    for col in columns:
        if col not in df.columns:
            continue
        series = pd.to_numeric(df[col], errors="coerce")
        valid = series.dropna()
        if valid.empty:
            continue

        mask = pd.Series(False, index=df.index)
        lower, upper = valid.min(), valid.max()
        if method in {"iqr", "both"}:
            q1 = valid.quantile(0.25)
            q3 = valid.quantile(0.75)
            iqr = q3 - q1
            lower = q1 - iqr_multiplier * iqr
            upper = q3 + iqr_multiplier * iqr
            mask = mask | (series < lower) | (series > upper)
        if method in {"zscore", "both"}:
            std = valid.std()
            if std and not np.isnan(std):
                mask = mask | (((series - valid.mean()) / std).abs() > z_threshold)

        mask = mask.fillna(False).astype(bool)
        count = int(mask.sum())
        log_record["outliers_detected"][col] = count

        if action == "flag":
            df[f"{col}_outlier"] = mask.astype("int8")
        elif action == "cap":
            df[col] = series.clip(lower=lower, upper=upper)
        elif action == "remove":
            combined_remove = combined_remove | mask

    if action == "remove" and combined_remove.any():
        before = len(df)
        df = df.loc[~combined_remove].reset_index(drop=True)
        log_record["invalid_rows_removed"] += int(before - len(df))
    return df


def validate_coordinates(
    df: pd.DataFrame,
    lat_col: str,
    lon_col: str,
    log_record: dict[str, Any],
    region: str = "india",
    action: str = "flag",
) -> pd.DataFrame:
    """Validate latitude/longitude against a regional bounding box."""
    if lat_col not in df.columns or lon_col not in df.columns:
        return df

    boxes = {
        "india": (6.0, 37.5, 68.0, 98.0),
        "london": (51.2, 51.8, -0.6, 0.4),
        "world": (-90.0, 90.0, -180.0, 180.0),
    }
    lat_min, lat_max, lon_min, lon_max = boxes.get(region, boxes["world"])
    lat = pd.to_numeric(df[lat_col], errors="coerce")
    lon = pd.to_numeric(df[lon_col], errors="coerce")
    invalid = lat.isna() | lon.isna() | ~lat.between(lat_min, lat_max) | ~lon.between(lon_min, lon_max)

    df = df.copy()
    if action == "flag":
        df["coord_invalid"] = invalid.astype("int8")
    elif action == "remove":
        before = len(df)
        df = df.loc[~invalid].reset_index(drop=True)
        log_record["invalid_rows_removed"] += int(before - len(df))
    elif action == "nullify":
        df.loc[invalid, [lat_col, lon_col]] = np.nan

    log_record["outliers_detected"]["invalid_coordinates"] = int(invalid.sum())
    return df


def save_clean_dataset(
    df: pd.DataFrame,
    output_filename: str,
    log_record: dict[str, Any],
) -> Path:
    """Save a cleaned CSV and update the log record."""
    output_path = PROCESSED_DIR / output_filename
    df.to_csv(output_path, index=False, encoding="utf-8")
    log_record["output_rows"] = int(len(df))
    log_record["output_cols"] = int(df.shape[1])
    log_record["output_filename"] = str(output_path)
    return output_path


def parse_time_to_minutes(series: pd.Series) -> pd.Series:
    """Convert HH:MM or HH:MM:SS values to minutes since midnight."""
    def parse_one(value: Any) -> float:
        if pd.isna(value) or str(value).strip().lower() in {"", "none", "nan", "nat"}:
            return np.nan
        parts = str(value).strip().split(":")
        if len(parts) < 2:
            return np.nan
        try:
            hour = int(parts[0])
            minute = int(parts[1])
        except ValueError:
            return np.nan
        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            return np.nan
        return float(hour * 60 + minute)

    return series.apply(parse_one)


def classify_train_type(name: Any) -> str:
    """Derive a broad train service type from a train name."""
    text = str(name).lower()
    patterns = {
        "Rajdhani": "rajdhani",
        "Shatabdi": "shatabdi",
        "Duronto": "duronto",
        "Garib Rath": "garib",
        "Mail": "mail",
        "Express": "express",
        "Passenger": "passenger",
        "Local/MEMU": "local|memu|mmts",
        "Intercity": "intercity",
        "Special": "special",
    }
    for label, pattern in patterns.items():
        if re.search(pattern, text):
            return label
    return "Other"
