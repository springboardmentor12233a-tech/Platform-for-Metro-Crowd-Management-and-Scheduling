"""
MetroFlow ML — Data Cleaner
Applies all cleaning steps identified during EDA.

Steps:
  1. Remove dead readings (entry=0 and exit=0)
  2. Cap outliers at 99th percentile
  3. Filter stations with insufficient data
  4. Sort by station + timestamp
"""

import pandas as pd
from ml.config import MIN_STATION_READINGS, OUTLIER_PERCENTILE


def remove_dead_readings(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows where both entry_count and exit_count are zero."""
    mask = (df["entry_count"] == 0) & (df["exit_count"] == 0)
    removed = mask.sum()
    df = df[~mask]
    print(f"[Cleaner] Step 1 — Removed {removed:,} dead readings")
    return df


def cap_outliers(df: pd.DataFrame) -> pd.DataFrame:
    """Cap entry_count and exit_count at the 99th percentile."""
    p99_entry = df["entry_count"].quantile(OUTLIER_PERCENTILE)
    p99_exit = df["exit_count"].quantile(OUTLIER_PERCENTILE)

    entry_capped = (df["entry_count"] > p99_entry).sum()
    exit_capped = (df["exit_count"] > p99_exit).sum()

    df["entry_count"] = df["entry_count"].clip(upper=p99_entry)
    df["exit_count"] = df["exit_count"].clip(upper=p99_exit)

    print(f"[Cleaner] Step 2 — Capped {entry_capped:,} entry + {exit_capped:,} exit outliers at P99")
    print(f"          Entry cap: {p99_entry:.0f}, Exit cap: {p99_exit:.0f}")
    return df


def filter_sparse_stations(df: pd.DataFrame) -> pd.DataFrame:
    """Remove stations with fewer than MIN_STATION_READINGS readings."""
    station_counts = df.groupby("station_id").size()
    valid = station_counts[station_counts >= MIN_STATION_READINGS].index
    removed = df["station_id"].nunique() - len(valid)
    df = df[df["station_id"].isin(valid)]
    print(f"[Cleaner] Step 3 — Removed {removed} sparse stations (< {MIN_STATION_READINGS} readings)")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Run the full cleaning pipeline.

    Returns a cleaned, sorted DataFrame ready for feature engineering.
    """
    initial_rows = len(df)
    initial_stations = df["station_id"].nunique()
    print(f"\n[Cleaner] Starting with {initial_rows:,} rows, {initial_stations} stations")

    df = remove_dead_readings(df)
    df = cap_outliers(df)
    df = filter_sparse_stations(df)

    # Sort for correct lag/rolling calculations
    df = df.sort_values(["station_id", "timestamp"]).reset_index(drop=True)

    final_rows = len(df)
    print(f"[Cleaner] Done — {final_rows:,} rows retained ({final_rows/initial_rows*100:.1f}%), "
          f"{df['station_id'].nunique()} stations")
    return df
