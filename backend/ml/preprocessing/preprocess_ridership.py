"""
Ridership Prediction Data Preprocessing

Author: Ankita Jana
Project: Metro Crowd Management System

Purpose:
    Prepare historical passenger-flow data for ridership prediction.

Model Design:
    Input:
        hour
        day
        month
        day_of_week
        weekend

    Targets:
        entry_count
        exit_count

    Derived:
        ridership = entry_count + exit_count

Station name is NOT used by the ML model.
"""

from pathlib import Path

import pandas as pd


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET_DIR = BASE_DIR / "datasets"

OUTPUT_DIR = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
)

INPUT_FILE = (
    DATASET_DIR
    / "crowd_history_preprocessed.csv"
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "ridership_training.csv"
)


# ==========================================================
# Create Output Directory
# ==========================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================================
# Start
# ==========================================================

print("=" * 60)
print(" RIDERSHIP DATA PREPROCESSING ")
print("=" * 60)


# ==========================================================
# Load Dataset
# ==========================================================

print()
print("Loading Dataset...")
print()

print(f"Input File:")
print(INPUT_FILE)

df = pd.read_csv(
    INPUT_FILE
)

print()
print(f"Rows Loaded : {len(df)}")
print(f"Columns     : {len(df.columns)}")
print()


# ==========================================================
# Validate Required Columns
# ==========================================================

print("=" * 60)
print("Validating Required Columns...")
print("=" * 60)

REQUIRED_COLUMNS = [
    "timestamp",
    "entry_count",
    "exit_count",
]

missing_columns = [
    column
    for column in REQUIRED_COLUMNS
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        "Missing required columns: "
        f"{missing_columns}"
    )

print()
print("All required columns are present.")
print()


# ==========================================================
# Initial Dataset Information
# ==========================================================

print("=" * 60)
print("Initial Dataset")
print("=" * 60)

print()

print(
    df[
        [
            "timestamp",
            "entry_count",
            "exit_count",
        ]
    ].head()
)

print()


# ==========================================================
# Timestamp Conversion
# ==========================================================

print("=" * 60)
print("Processing Timestamp...")
print("=" * 60)

df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    errors="coerce",
)

invalid_timestamps = (
    df["timestamp"].isna().sum()
)

print()
print(
    f"Invalid timestamps: "
    f"{invalid_timestamps}"
)


# ==========================================================
# Remove Invalid Timestamps
# ==========================================================

if invalid_timestamps > 0:

    df = df.dropna(
        subset=["timestamp"]
    ).copy()


# ==========================================================
# Numeric Conversion
# ==========================================================

print()
print("=" * 60)
print("Processing Passenger Counts...")
print("=" * 60)

df["entry_count"] = pd.to_numeric(
    df["entry_count"],
    errors="coerce",
)

df["exit_count"] = pd.to_numeric(
    df["exit_count"],
    errors="coerce",
)


# ==========================================================
# Remove Invalid Passenger Counts
# ==========================================================

invalid_counts = (
    df[
        [
            "entry_count",
            "exit_count",
        ]
    ]
    .isna()
    .any(axis=1)
    .sum()
)

print()
print(
    f"Invalid passenger records: "
    f"{invalid_counts}"
)

if invalid_counts > 0:

    df = df.dropna(
        subset=[
            "entry_count",
            "exit_count",
        ]
    ).copy()


# ==========================================================
# Remove Negative Passenger Counts
# ==========================================================

negative_entries = (
    df["entry_count"] < 0
).sum()

negative_exits = (
    df["exit_count"] < 0
).sum()

print()
print(
    f"Negative entry records: "
    f"{negative_entries}"
)

print(
    f"Negative exit records: "
    f"{negative_exits}"
)


# Passenger counts cannot be negative.
df = df[
    (df["entry_count"] >= 0)
    &
    (df["exit_count"] >= 0)
].copy()


# ==========================================================
# Time Feature Engineering
# ==========================================================

print()
print("=" * 60)
print("Creating Time Features...")
print("=" * 60)


# Hour of day: 0-23
df["hour"] = (
    df["timestamp"].dt.hour
)


# Day of month: 1-31
df["day"] = (
    df["timestamp"].dt.day
)


# Month: 1-12
df["month"] = (
    df["timestamp"].dt.month
)


# Day of week:
# Monday = 0
# Tuesday = 1
# ...
# Sunday = 6
df["day_of_week"] = (
    df["timestamp"].dt.dayofweek
)


# Weekend:
# Saturday = 1
# Sunday = 1
# Otherwise = 0
df["weekend"] = (
    df["day_of_week"]
    .isin([5, 6])
    .astype(int)
)


# ==========================================================
# Derived Ridership
# ==========================================================

print()
print("=" * 60)
print("Creating Ridership Target...")
print("=" * 60)


df["ridership"] = (
    df["entry_count"]
    + df["exit_count"]
)


# ==========================================================
# Remove Duplicate Records
# ==========================================================

print()
print("=" * 60)
print("Removing Duplicate Records...")
print("=" * 60)

before_duplicates = len(df)

df.drop_duplicates(
    inplace=True
)

after_duplicates = len(df)

duplicates_removed = (
    before_duplicates
    - after_duplicates
)

print()
print(
    f"Duplicates Removed: "
    f"{duplicates_removed}"
)


# ==========================================================
# ML Dataset
# ==========================================================

print()
print("=" * 60)
print("Preparing ML Dataset...")
print("=" * 60)


# IMPORTANT:
#
# We deliberately do NOT use:
#
# station_name
# id
# timestamp
# crowd_density
#
# We also do NOT use current entry_count
# or exit_count as model input because they
# are the quantities we want to predict.

FEATURES = [
    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",
]


TARGETS = [
    "entry_count",
    "exit_count",
]


# ==========================================================
# Select Final Columns
# ==========================================================

final_columns = (
    FEATURES
    + TARGETS
)

df_final = df[
    final_columns
].copy()


# ==========================================================
# Final Missing Value Check
# ==========================================================

print()
print("=" * 60)
print("Final Missing Value Check...")
print("=" * 60)

missing_values = (
    df_final.isna().sum()
)

print()
print(
    missing_values
)


if missing_values.sum() > 0:

    raise ValueError(
        "Missing values detected "
        "after preprocessing."
    )


# ==========================================================
# Reset Index
# ==========================================================

df_final.reset_index(
    drop=True,
    inplace=True,
)


# ==========================================================
# Save Processed Dataset
# ==========================================================

df_final.to_csv(
    OUTPUT_FILE,
    index=False,
)


# ==========================================================
# Statistics
# ==========================================================

print()
print("=" * 60)
print("RIDERSHIP STATISTICS")
print("=" * 60)

print()

print(
    "Entry Count Statistics:"
)

print(
    df_final[
        "entry_count"
    ].describe()
)

print()

print(
    "Exit Count Statistics:"
)

print(
    df_final[
        "exit_count"
    ].describe()
)

print()

print(
    "Total Ridership Statistics:"
)

ridership_series = (
    df_final["entry_count"]
    + df_final["exit_count"]
)

print(
    ridership_series.describe()
)


# ==========================================================
# Final Dataset Information
# ==========================================================

print()
print("=" * 60)
print("PREPROCESSING COMPLETED")
print("=" * 60)

print()

print(
    f"Final Dataset Shape: "
    f"{df_final.shape}"
)

print()

print("Final ML Features:")

for feature in FEATURES:

    print(
        f"  ✓ {feature}"
    )

print()

print("Prediction Targets:")

for target in TARGETS:

    print(
        f"  ✓ {target}"
    )

print()

print(
    "Station Name: "
    "OPTIONAL / NOT USED BY MODEL"
)

print()

print(
    "Current Entry/Exit Counts: "
    "TARGETS / NOT USED AS INPUT"
)

print()

print(
    "Derived Ridership:"
)

print(
    "  ridership = "
    "entry_count + exit_count"
)

print()

print(
    f"Processed Dataset Saved To:"
)

print(
    OUTPUT_FILE
)

print()

print("First 10 Records:")

print(
    df_final.head(10).to_string(
        index=False
    )
)

print()

print("=" * 60)
print("DONE")
print("=" * 60)