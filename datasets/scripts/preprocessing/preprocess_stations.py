from __future__ import annotations

import json
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
    validate_coordinates,
)

DATASET_NAME = "stations"
RAW_PATH = RAW_DIR / "stations.json"
OUT_FILE = "stations_preprocessed.csv"


def _flatten_station_features(data: dict) -> pd.DataFrame:
    rows = []
    for feature in data.get("features", []):
        properties = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or [None, None]
        rows.append(
            {
                "station_code": properties.get("code"),
                "station_name": properties.get("name"),
                "state": properties.get("state"),
                "zone": properties.get("zone"),
                "address": properties.get("address"),
                "geometry_type": geometry.get("type"),
                "longitude": coords[0] if len(coords) > 0 else None,
                "latitude": coords[1] if len(coords) > 1 else None,
            }
        )
    return pd.DataFrame(rows)


def run() -> None:
    logger, log_record = build_logger(DATASET_NAME)
    data = json.loads(RAW_PATH.read_text(encoding="utf-8"))
    df = _flatten_station_features(data)
    record_input(df, log_record)
    logger.info("loaded rows=%s cols=%s", len(df), df.shape[1])

    df = clean_column_names(df)
    df = remove_duplicates(df, log_record, subset=["station_code"])
    df = convert_numeric(df, ["latitude", "longitude"], log_record)
    df = standardize_categories(df, ["station_code", "zone"], case="upper")
    df = standardize_categories(df, ["station_name", "state", "address", "geometry_type"])
    df = handle_missing_values(
        df,
        log_record,
        {
            "station_code": "drop_row",
            "station_name": "drop_row",
            "state": "unknown",
            "zone": "unknown",
            "address": "unknown",
            "geometry_type": "unknown",
        },
    )
    df = validate_coordinates(df, "latitude", "longitude", log_record, region="india", action="flag")
    df["code_length"] = df["station_code"].astype("string").str.len()
    df["name_word_count"] = df["station_name"].astype("string").str.split().str.len()
    df["is_junction"] = df["station_name"].astype("string").str.contains(r"\bJn\b|Junction", case=False, na=False).astype("int8")
    df["is_road_station"] = df["station_name"].astype("string").str.contains(r"\bRoad\b", case=False, na=False).astype("int8")
    df = detect_outliers(df, ["code_length", "name_word_count"], log_record)

    output_path = save_clean_dataset(df, OUT_FILE, log_record)
    logger.info("saved output=%s", output_path)
    flush_log(DATASET_NAME, log_record, logger)


if __name__ == "__main__":
    run()

