"""
MetroFlow ML — Feature Engineering
Transforms cleaned data into model-ready features.

Feature groups:
  - Temporal:  hour, time_block, day_of_week, is_weekend, month
  - Station:   is_interchange, max_capacity
  - Lag:       lag_1, lag_2, lag_3
  - Rolling:   rolling_mean_3, rolling_std_3
  - Derived:   entry_exit_ratio
"""

import numpy as np
import pandas as pd
from ml.config import FEATURES


def add_temporal_features(df: pd.DataFrame) -> pd.DataFrame:
    """Extract time-based features from the timestamp column."""
    df["hour"] = df["timestamp"].dt.hour
    df["time_block"] = df["hour"].apply(
        lambda h: 0 if h <= 3 else (1 if h <= 11 else 2)
    )
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    df["month"] = df["timestamp"].dt.month
    return df


def add_station_features(df: pd.DataFrame) -> pd.DataFrame:
    """Convert station-level booleans to integers."""
    df["is_interchange"] = df["is_interchange"].astype(int)
    return df


def add_lag_features(df: pd.DataFrame, lags: list[int] = [1, 2, 3]) -> pd.DataFrame:
    """Add lagged entry_count values per station."""
    for lag in lags:
        df[f"lag_{lag}"] = df.groupby("station_id")["entry_count"].shift(lag)
    return df


def add_rolling_features(df: pd.DataFrame, window: int = 3) -> pd.DataFrame:
    """Add rolling mean and standard deviation per station."""
    df[f"rolling_mean_{window}"] = df.groupby("station_id")["entry_count"] \
        .transform(lambda x: x.rolling(window, min_periods=1).mean())
    df[f"rolling_std_{window}"] = df.groupby("station_id")["entry_count"] \
        .transform(lambda x: x.rolling(window, min_periods=1).std().fillna(0))
    return df


def add_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add computed features from existing columns."""
    df["entry_exit_ratio"] = df["entry_count"] / (df["exit_count"] + 1)
    return df


def add_targets(df: pd.DataFrame) -> pd.DataFrame:
    """Create prediction targets by shifting entry_count forward."""
    df["target_1h"] = df.groupby("station_id")["entry_count"].shift(-1)
    df["target_4h"] = df.groupby("station_id")["entry_count"].shift(-4)
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Run the full feature engineering pipeline.

    Returns a DataFrame with all features + targets, NaN rows dropped.
    """
    print(f"\n[Features] Starting with {len(df):,} rows")
    df = df.copy()

    df = add_temporal_features(df)
    df = add_station_features(df)
    df = add_lag_features(df)
    df = add_rolling_features(df)
    df = add_derived_features(df)
    df = add_targets(df)

    # Drop NaN rows from lags/targets
    before = len(df)
    df = df.replace([np.inf, -np.inf], np.nan).dropna()
    dropped = before - len(df)

    print(f"[Features] Created {len(FEATURES)} features, dropped {dropped:,} NaN rows")
    print(f"[Features] Final dataset: {len(df):,} rows")
    return df
