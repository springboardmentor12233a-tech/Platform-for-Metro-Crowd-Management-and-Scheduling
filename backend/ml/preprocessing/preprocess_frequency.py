"""
Frequency Adjustment Data Preprocessing

Project: Metro Crowd Management System

Purpose:
    Prepare occupancy and time-based data for the
    Dynamic Frequency Recommendation model.

Output classes:
    0 -> Decrease
    1 -> Maintain
    2 -> Increase
"""

from pathlib import Path

import pandas as pd


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = (
    BASE_DIR
    / "datasets"
    / "occupancy_preprocessed.csv"
)

OUTPUT_FILE = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "frequency_training.csv"
)


# ============================================================
# Create Output Directory
# ============================================================

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# Load Dataset
# ============================================================

print("=" * 60)
print("FREQUENCY ADJUSTMENT DATA PREPROCESSING")
print("=" * 60)

print(f"\nLoading dataset:")
print(INPUT_FILE)

df = pd.read_csv(INPUT_FILE)

print(f"\nRows Loaded : {len(df)}")

print("\nOriginal Columns:")
print(df.columns.tolist())


# ============================================================
# Validate Required Columns
# ============================================================

required_columns = [
    "id",
    "train_id",
    "station_name",
    "timestamp",
    "occupancy",
    "capacity",
    "occupancy_percentage",
    "crowd_level",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )


# ============================================================
# Keep Required Columns
# ============================================================

df = df[required_columns].copy()


# ============================================================
# Clean String Columns
# ============================================================

for column in [
    "id",
    "train_id",
    "station_name",
    "crowd_level",
]:

    df[column] = (
        df[column]
        .astype(str)
        .str.strip()
    )


# ============================================================
# Convert Numeric Columns
# ============================================================

numeric_columns = [
    "occupancy",
    "capacity",
    "occupancy_percentage",
]

for column in numeric_columns:

    df[column] = pd.to_numeric(
        df[column],
        errors="coerce",
    )


# ============================================================
# Convert Timestamp
# ============================================================

df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    errors="coerce",
)


# ============================================================
# Remove Invalid Records
# ============================================================

before = len(df)

df.dropna(
    subset=[
        "timestamp",
        "occupancy",
        "capacity",
        "occupancy_percentage",
    ],
    inplace=True,
)

print(
    f"\nInvalid rows removed: "
    f"{before - len(df)}"
)


# ============================================================
# Remove Impossible Values
# ============================================================

before = len(df)

df = df[
    (df["capacity"] > 0)
    & (df["occupancy"] >= 0)
    & (df["occupancy_percentage"] >= 0)
].copy()

print(
    f"Impossible rows removed: "
    f"{before - len(df)}"
)


# ============================================================
# Remove Duplicates
# ============================================================

before = len(df)

df.drop_duplicates(
    subset=["id"],
    inplace=True,
)

print(
    f"Duplicate rows removed: "
    f"{before - len(df)}"
)


# ============================================================
# Recalculate Occupancy Percentage
# ============================================================

df["occupancy_percentage"] = (
    df["occupancy"]
    / df["capacity"]
    * 100
)


# ============================================================
# Time Features
# ============================================================

df["hour"] = (
    df["timestamp"].dt.hour
)

df["minute"] = (
    df["timestamp"].dt.minute
)


# ============================================================
# Calendar Features
# ============================================================

df["day_of_week"] = (
    df["timestamp"].dt.dayofweek
)

df["month"] = (
    df["timestamp"].dt.month
)

df["day"] = (
    df["timestamp"].dt.day
)

df["is_weekend"] = (
    df["day_of_week"]
    .isin([5, 6])
    .astype(int)
)


# ============================================================
# Peak Hour
# ============================================================

df["peak_hour"] = (
    (
        (df["hour"] >= 7)
        & (df["hour"] <= 10)
    )
    |
    (
        (df["hour"] >= 17)
        & (df["hour"] <= 20)
    )
).astype(int)


# ============================================================
# Occupancy Utilization
# ============================================================

df["occupancy_ratio"] = (
    df["occupancy"]
    / df["capacity"]
)


# ============================================================
# Frequency Recommendation
# ============================================================
#
# This is a RULE-BASED TARGET.
#
# It is used because the current occupancy dataset does not
# contain historical operator decisions such as:
#
#   increase_frequency
#   maintain_frequency
#   decrease_frequency
#
# Therefore the ML model will learn this recommendation rule.
#
# 0 -> Decrease
# 1 -> Maintain
# 2 -> Increase
#
# ------------------------------------------------------------
# Current thresholds:
#
# < 40%       -> Decrease
# 40% - 75%   -> Maintain
# > 75%       -> Increase
#
# Peak-hour adjustment:
#
# During peak hours, >70% occupancy is treated as Increase.
# ============================================================

def create_frequency_action(row):

    occupancy = row["occupancy_percentage"]
    peak_hour = row["peak_hour"]

    # ----------------------------------------------
    # Peak period
    # ----------------------------------------------

    if peak_hour == 1:

        if occupancy >= 70:
            return "Increase"

        elif occupancy < 30:
            return "Decrease"

        else:
            return "Maintain"

    # ----------------------------------------------
    # Normal period
    # ----------------------------------------------

    if occupancy >= 75:
        return "Increase"

    elif occupancy < 40:
        return "Decrease"

    else:
        return "Maintain"


df["frequency_action"] = (
    df.apply(
        create_frequency_action,
        axis=1,
    )
)


# ============================================================
# Encode Target
# ============================================================

frequency_mapping = {
    "Decrease": 0,
    "Maintain": 1,
    "Increase": 2,
}

df["frequency_action"] = (
    df["frequency_action"]
    .map(frequency_mapping)
)


# ============================================================
# Remove Rows Where Target Could Not Be Created
# ============================================================

df.dropna(
    subset=["frequency_action"],
    inplace=True,
)


df["frequency_action"] = (
    df["frequency_action"]
    .astype(int)
)


# ============================================================
# Final ML Features
# ============================================================
#
# station_name is deliberately NOT used by the model.
#
# This keeps the model general and allows it to work for
# stations that were not present during training.
# ============================================================

training_columns = [

    "occupancy",

    "capacity",

    "occupancy_percentage",

    "occupancy_ratio",

    "hour",

    "minute",

    "day",

    "month",

    "day_of_week",

    "is_weekend",

    "peak_hour",

    "frequency_action",
]


df = df[training_columns].copy()


# ============================================================
# Final Validation
# ============================================================

print("\n" + "=" * 60)
print("FINAL DATASET")
print("=" * 60)

print(
    f"\nFinal Dataset Shape: "
    f"{df.shape}"
)

print("\nFinal Columns:")

for column in df.columns:

    if column == "frequency_action":

        print(
            f"  ✓ {column}  <-- TARGET"
        )

    else:

        print(
            f"  ✓ {column}"
        )


# ============================================================
# Target Distribution
# ============================================================

print("\n" + "=" * 60)
print("FREQUENCY ACTION DISTRIBUTION")
print("=" * 60)

action_counts = (
    df["frequency_action"]
    .value_counts()
    .sort_index()
)

action_names = {
    0: "Decrease",
    1: "Maintain",
    2: "Increase",
}

for value, count in action_counts.items():

    percentage = (
        count
        / len(df)
        * 100
    )

    print(
        f"{action_names[value]:10s} : "
        f"{count:6d} "
        f"({percentage:.2f}%)"
    )


# ============================================================
# Occupancy Statistics
# ============================================================

print("\n" + "=" * 60)
print("OCCUPANCY STATISTICS")
print("=" * 60)

print(
    df[
        [
            "occupancy",
            "capacity",
            "occupancy_percentage",
        ]
    ].describe()
)


# ============================================================
# Missing Values
# ============================================================

print("\n" + "=" * 60)
print("MISSING VALUES")
print("=" * 60)

print(
    df.isnull()
    .sum()
)


# ============================================================
# Save Dataset
# ============================================================

df.to_csv(
    OUTPUT_FILE,
    index=False,
)


# ============================================================
# Completion
# ============================================================

print("\n" + "=" * 60)
print("FREQUENCY PREPROCESSING COMPLETED")
print("=" * 60)

print(
    f"\nProcessed dataset saved to:"
    f"\n{OUTPUT_FILE}"
)

print("\nML Features:")

for column in training_columns[:-1]:

    print(
        f"  ✓ {column}"
    )

print("\nML Target:")

print(
    "  ✓ frequency_action"
)

print("\nTarget Mapping:")

print(
    "  0 -> Decrease"
)

print(
    "  1 -> Maintain"
)

print(
    "  2 -> Increase"
)

print("\nStation Name:")

print(
    "  OPTIONAL / NOT USED BY MODEL"
)

print("\n" + "=" * 60)