from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))

from preprocess_common import (
    RAW_DIR,
    build_logger,
    classify_train_type,
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
    validate_coordinates,
)

DATASET_NAME = "trains"
RAW_PATH = RAW_DIR / "trains.json"
OUT_FILE = "trains_preprocessed.csv"


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    if any(pd.isna(v) for v in [lat1, lon1, lat2, lon2]):
        return np.nan
    radius = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _flatten_train_features(data: dict) -> pd.DataFrame:
    rows = []
    for feature in data.get("features", []):
        properties = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        first = coords[0] if coords else [None, None]
        last = coords[-1] if coords else [None, None]
        row = dict(properties)
        row.update(
            {
                "geometry_type": geometry.get("type"),
                "num_route_coords": len(coords),
                "origin_lon": first[0] if len(first) > 0 else None,
                "origin_lat": first[1] if len(first) > 1 else None,
                "dest_lon": last[0] if len(last) > 0 else None,
                "dest_lat": last[1] if len(last) > 1 else None,
            }
        )
        rows.append(row)
    return pd.DataFrame(rows)


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    data = json.loads(RAW_PATH.read_text(encoding="utf-8"))
    df = _flatten_train_features(data)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = df.rename(columns={"number": "train_number", "name": "train_name", "type": "service_type"})
    df = remove_duplicates(df, log_record, subset=["train_number"])
    numeric_cols = [
        "duration_m",
        "duration_h",
        "distance",
        "num_route_coords",
        "origin_lon",
        "origin_lat",
        "dest_lon",
        "dest_lat",
    ]
    class_cols = ["third_ac", "chair_car", "first_class", "sleeper", "second_ac", "first_ac"]
    df = convert_numeric(df, numeric_cols + class_cols, log_record)
    for col in ["departure", "arrival"]:
        if col in df.columns:
            df[f"{col}_min"] = parse_time_to_minutes(df[col])
            log_record["columns_converted"].append(f"{col}:time_minutes")
    df = standardize_categories(df, ["train_number", "zone", "from_station_code", "to_station_code"], case="upper")
    df = standardize_categories(df, ["train_name", "from_station_name", "to_station_name", "service_type"])
    df = handle_missing_values(
        df,
        log_record,
        {
            "train_number": "drop_row",
            "train_name": "unknown",
            "zone": "unknown",
            "from_station_code": "unknown",
            "to_station_code": "unknown",
            "duration_m": "median",
            "duration_h": "median",
        },
    )

    for col in class_cols:
        if col in df.columns:
            df[col] = df[col].fillna(0).astype("int8")
    df["route_distance_km"] = df.apply(
        lambda row: _haversine_km(row["origin_lat"], row["origin_lon"], row["dest_lat"], row["dest_lon"]),
        axis=1,
    )
    df["duration_hours_clean"] = df["duration_m"] / 60
    df["avg_speed_kmh"] = df["route_distance_km"] / df["duration_hours_clean"].replace(0, np.nan)
    df["train_type"] = df["train_name"].apply(classify_train_type)
    df["num_classes"] = df[[col for col in class_cols if col in df.columns]].sum(axis=1)
    df["is_peak_departure"] = (np.floor(df["departure_min"] / 60).isin([7, 8, 9, 17, 18, 19])).astype("int8")

    df = validate_coordinates(df, "origin_lat", "origin_lon", log_record, region="india", action="flag")
    df = validate_coordinates(df, "dest_lat", "dest_lon", log_record, region="india", action="flag")
    invalid_speed = df["avg_speed_kmh"].notna() & ~df["avg_speed_kmh"].between(5, 300)
    df["speed_invalid"] = invalid_speed.astype("int8")
    log_record["warnings"].append(f"{int(invalid_speed.sum())} train speed values outside [5,300] km/h flagged")
    df = detect_outliers(df, ["duration_m", "route_distance_km", "avg_speed_kmh", "num_route_coords"], log_record)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()
