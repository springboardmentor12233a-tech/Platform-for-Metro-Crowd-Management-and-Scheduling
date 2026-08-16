"""
Crowd Prediction Data Preprocessing

Author: Ankita Jana
Project: Metro Crowd Management System

Purpose:
    Prepare crowd history data for crowd-level classification.

    Crowd level is derived from passenger flow:

        passenger_flow = entry_count + exit_count

    The station name is retained in the processed dataset for
    reference/UI purposes, but it is NOT used by the ML model.
"""

from pathlib import Path
import json

import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET = (
    BASE_DIR
    / "datasets"
    / "crowd_history_preprocessed.csv"
)

OUTPUT = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "crowd_training.csv"
)

MODELS_DIR = BASE_DIR / "ml" / "models"

METRICS_DIR = (
    BASE_DIR
    / "ml"
    / "metrics"
)

THRESHOLD_PATH = (
    METRICS_DIR
    / "crowd_flow_thresholds.json"
)


# ==========================================================
# Create Directories
# ==========================================================

MODELS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

METRICS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================================
# Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Crowd History Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(f"Dataset Shape: {df.shape}")
print()

print(df.head())
print()


# ==========================================================
# Remove Unnecessary ID Columns
# ==========================================================

columns_to_drop = [
    "id",
    "record_id",
]

df.drop(
    columns=[
        column
        for column in columns_to_drop
        if column in df.columns
    ],
    inplace=True,
)


# ==========================================================
# Validate Required Columns
# ==========================================================

required_columns = [
    "station_name",
    "timestamp",
    "entry_count",
    "exit_count",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        "Missing required columns: "
        + ", ".join(missing_columns)
    )


# ==========================================================
# Clean Passenger Counts
# ==========================================================

df["entry_count"] = pd.to_numeric(
    df["entry_count"],
    errors="coerce",
)

df["exit_count"] = pd.to_numeric(
    df["exit_count"],
    errors="coerce",
)

# Replace invalid values with zero
df["entry_count"] = (
    df["entry_count"]
    .fillna(0)
    .clip(lower=0)
)

df["exit_count"] = (
    df["exit_count"]
    .fillna(0)
    .clip(lower=0)
)


# ==========================================================
# Passenger Flow
# ==========================================================

df["passenger_flow"] = (
    df["entry_count"]
    + df["exit_count"]
)


print("=" * 60)
print("Passenger Flow Statistics")
print("=" * 60)

print(
    df["passenger_flow"]
    .describe()
)

print()


# ==========================================================
# Timestamp Features
# ==========================================================

df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    errors="coerce",
)

if df["timestamp"].isna().any():

    invalid_dates = df["timestamp"].isna().sum()

    print(
        f"WARNING: {invalid_dates} invalid timestamps found."
    )

    df = df.dropna(
        subset=["timestamp"]
    )


df["hour"] = (
    df["timestamp"]
    .dt.hour
)

df["day"] = (
    df["timestamp"]
    .dt.day
)

df["month"] = (
    df["timestamp"]
    .dt.month
)

df["day_of_week"] = (
    df["timestamp"]
    .dt.dayofweek
)

df["weekend"] = (
    df["day_of_week"] >= 5
).astype(int)


# ==========================================================
# Crowd Level Creation
# ==========================================================
#
# We classify passenger flow instead of using crowd_density.
#
# IMPORTANT:
#
# Zero passenger flow is explicitly classified as LOW.
#
# For positive passenger flow:
#
#   Bottom 33%  -> Medium
#   Middle 33%  -> High
#   Top 33%     -> Very High
#
# This prevents the previous problem where:
#
#     0 passengers -> Medium
#
# ==========================================================

# ==========================================================
# Crowd Level Creation
# ==========================================================

positive_flow = df.loc[
    df["passenger_flow"] > 0,
    "passenger_flow",
]

if positive_flow.empty:
    raise ValueError(
        "No positive passenger-flow values found."
    )

medium_threshold = float(
    positive_flow.quantile(0.33)
)

high_threshold = float(
    positive_flow.quantile(0.66)
)


def create_crowd_level(flow):
    """
    Create crowd levels from passenger flow.

    0 = Low
    1 = Medium
    2 = High
    3 = Very High
    """

    if flow == 0:
        return "Low"

    elif flow <= 717:
        return "Medium"

    elif flow <= 1901:
        return "High"

    else:
        return "Very High"


df["crowd_level"] = (
    df["passenger_flow"]
    .apply(create_crowd_level)
)

# ==========================================================
# Display Crowd Distribution
# ==========================================================

print("=" * 60)
print("Crowd Level Distribution")
print("=" * 60)

print(
    df["crowd_level"]
    .value_counts()
)

print()

print(
    df["crowd_level"]
    .value_counts(
        normalize=True
    ).mul(100).round(2)
)

print()


# ==========================================================
# Save Thresholds
# ==========================================================

thresholds = {
    "definition": (
        "Crowd level based on passenger_flow = "
        "entry_count + exit_count"
    ),
    "low": {
        "minimum": 0,
        "maximum": 0,
    },
    "medium": {
        "minimum": 1,
        "maximum": medium_threshold,
    },
    "high": {
        "minimum": medium_threshold,
        "maximum": high_threshold,
    },
    "very_high": {
        "minimum": high_threshold,
        "maximum": None,
    },
}

with open(
    THRESHOLD_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        thresholds,
        file,
        indent=4,
    )


# ==========================================================
# Station Handling
# ==========================================================
#
# Station is retained as text for reference.
#
# IMPORTANT:
# The training script will NOT include station_name
# in X.
#
# Therefore no LabelEncoder is required for station.
#
# ==========================================================

df["station_name"] = (
    df["station_name"]
    .astype(str)
    .str.strip()
)


# ==========================================================
# Encode Target
# ==========================================================

crowd_level_mapping = {
    "Low": 0,
    "Medium": 1,
    "High": 2,
    "Very High": 3,
}

df["crowd_level"] = (
    df["crowd_level"]
    .map(crowd_level_mapping)
)

# ==========================================================
# Save Target Encoder
# ==========================================================

joblib.dump(
    crowd_level_mapping,
    MODELS_DIR / "crowd_label_encoder.pkl",
)


# ==========================================================
# Final Dataset Columns
# ==========================================================
#
# passenger_flow is kept for analysis/reference.
#
# crowd_density is intentionally NOT used.
#
# station_name is kept but NOT used by the model.
#
# ==========================================================

final_columns = [
    "station_name",

    "entry_count",
    "exit_count",

    "platform_count",
    "concourse_count",

    "passenger_flow",

    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",

    "crowd_level",
]


# Only keep columns that actually exist.

final_columns = [
    column
    for column in final_columns
    if column in df.columns
]

df = df[final_columns]


# ==========================================================
# Save Processed Dataset
# ==========================================================

df.to_csv(
    OUTPUT,
    index=False,
)


# ==========================================================
# Final Information
# ==========================================================

print("=" * 60)
print("Preprocessing Complete")
print("=" * 60)

print()

print("Final Dataset Shape:")
print(df.shape)

print()

print("Final Columns:")
for column in df.columns:
    print(f"  ✓ {column}")

print()

print("ML Target:")
print("  ✓ crowd_level")

print()

print("ML Input Features:")
print("  ✓ entry_count")
print("  ✓ exit_count")
print("  ✓ hour")
print("  ✓ day")
print("  ✓ month")
print("  ✓ day_of_week")
print("  ✓ weekend")

print()

print(
    "Station Name: OPTIONAL / NOT USED BY MODEL"
)

print()

print(
    "Passenger Flow Thresholds:"
)

print(
    f"  Low       : 0"
)

print(
    f"  Medium    : 1 - {medium_threshold:.2f}"
)

print(
    f"  High      : {medium_threshold:.2f} - "
    f"{high_threshold:.2f}"
)

print(
    f"  Very High : > {high_threshold:.2f}"
)

print()

print(
    f"Processed dataset saved to:\n{OUTPUT}"
)

print()

print(
    f"Crowd label encoder saved to:\n"
    f"{MODELS_DIR / 'crowd_label_encoder.pkl'}"
)

print()

print(
    f"Thresholds saved to:\n"
    f"{THRESHOLD_PATH}"
)

print()

print("=" * 60)
print("Crowd Preprocessing Completed Successfully")
print("=" * 60)