from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

TRIP_FILE = (
    BASE_DIR
    / "datasets"
    / "trips_preprocessed.csv"
)

DELAY_FILE = (
    BASE_DIR
    / "datasets"
    / "delay_preprocessed.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "schedule_training.csv"
)


# ============================================================
# CREATE OUTPUT DIRECTORY
# ============================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# LOAD DATASETS
# ============================================================

print("=" * 60)
print("SCHEDULE OPTIMIZATION PREPROCESSING")
print("=" * 60)

print(f"Trip file:   {TRIP_FILE}")
print(f"Delay file:  {DELAY_FILE}")

trips = pd.read_csv(TRIP_FILE)
delays = pd.read_csv(DELAY_FILE)

print(f"\nTrip rows:  {len(trips)}")
print(f"Delay rows: {len(delays)}")


# ============================================================
# REQUIRED TRIP COLUMNS
# ============================================================

trip_required = [
    "train_id",
    "origin_station",
    "destination_station",
    "departure_time",
    "arrival_time",
    "trip_date",
    "trip_duration_min",
    "distance_km",
    "average_speed_kmh",
]

missing_trip = [
    column
    for column in trip_required
    if column not in trips.columns
]

if missing_trip:

    raise ValueError(
        f"Missing trip columns: {missing_trip}"
    )


# ============================================================
# REQUIRED DELAY COLUMNS
# ============================================================

delay_required = [
    "actual_departure_delay_min",
    "time",
    "weekday",
]

missing_delay = [
    column
    for column in delay_required
    if column not in delays.columns
]

if missing_delay:

    raise ValueError(
        f"Missing delay columns: {missing_delay}"
    )


# ============================================================
# KEEP REQUIRED TRIP COLUMNS
# ============================================================

trips = trips[
    trip_required
].copy()


# ============================================================
# REMOVE DUPLICATES
# ============================================================

before = len(trips)

trips = trips.drop_duplicates()

print(
    f"Removed trip duplicates: "
    f"{before - len(trips)}"
)


# ============================================================
# CLEAN TRIP DATA
# ============================================================

numeric_columns = [
    "trip_duration_min",
    "distance_km",
    "average_speed_kmh",
]

for column in numeric_columns:

    trips[column] = pd.to_numeric(
        trips[column],
        errors="coerce",
    )


# ============================================================
# DATE
# ============================================================

trips["trip_date"] = pd.to_datetime(
    trips["trip_date"],
    errors="coerce",
)


# ============================================================
# DEPARTURE TIME
# ============================================================

trips["departure_time"] = pd.to_datetime(
    trips["departure_time"],
    format="%H:%M:%S",
    errors="coerce",
)


# ============================================================
# ARRIVAL TIME
# ============================================================

trips["arrival_time"] = pd.to_datetime(
    trips["arrival_time"],
    format="%H:%M:%S",
    errors="coerce",
)


# ============================================================
# REMOVE INVALID TRIP ROWS
# ============================================================

before = len(trips)

trips = trips.dropna(
    subset=[
        "train_id",
        "origin_station",
        "destination_station",
        "departure_time",
        "trip_date",
        "trip_duration_min",
        "distance_km",
        "average_speed_kmh",
    ]
)

print(
    f"Removed invalid trip rows: "
    f"{before - len(trips)}"
)


# ============================================================
# REMOVE IMPOSSIBLE VALUES
# ============================================================

trips = trips[
    (trips["trip_duration_min"] > 0)
    & (trips["distance_km"] > 0)
    & (trips["average_speed_kmh"] > 0)
].copy()


# ============================================================
# TIME FEATURES
# ============================================================

trips["departure_hour"] = (
    trips["departure_time"].dt.hour
)

trips["departure_minute"] = (
    trips["departure_time"].dt.minute
)

trips["departure_minute_of_day"] = (
    trips["departure_hour"] * 60
    + trips["departure_minute"]
)


# ============================================================
# CALENDAR FEATURES
# ============================================================

trips["day"] = (
    trips["trip_date"].dt.day
)

trips["day_of_week"] = (
    trips["trip_date"].dt.dayofweek
)

trips["month"] = (
    trips["trip_date"].dt.month
)

trips["is_weekend"] = (
    trips["day_of_week"] >= 5
).astype(int)


# ============================================================
# PEAK HOUR
# ============================================================

trips["peak_hour"] = (
    (
        (trips["departure_hour"] >= 7)
        & (trips["departure_hour"] <= 10)
    )
    |
    (
        (trips["departure_hour"] >= 17)
        & (trips["departure_hour"] <= 20)
    )
).astype(int)


# ============================================================
# SPEED EFFICIENCY
# ============================================================

trips["speed_efficiency"] = (
    trips["distance_km"]
    / trips["trip_duration_min"]
)


# ============================================================
# CLEAN STRING COLUMNS
# ============================================================

for column in [
    "train_id",
    "origin_station",
    "destination_station",
]:

    trips[column] = (
        trips[column]
        .astype(str)
        .str.strip()
    )


# ============================================================
# PREPARE DELAY DATA
# ============================================================

delays = delays.copy()


# ============================================================
# CONVERT DELAY VALUES
# ============================================================

delays[
    "actual_departure_delay_min"
] = pd.to_numeric(
    delays[
        "actual_departure_delay_min"
    ],
    errors="coerce",
)


# ============================================================
# EXTRACT DELAY HOUR
# ============================================================

delays["delay_time"] = pd.to_datetime(
    delays["time"],
    format="%H:%M:%S",
    errors="coerce",
)

delays["departure_hour"] = (
    delays["delay_time"].dt.hour
)


# ============================================================
# CLEAN WEEKDAY
# ============================================================

delays["weekday"] = pd.to_numeric(
    delays["weekday"],
    errors="coerce",
)


# ============================================================
# REMOVE INVALID DELAY ROWS
# ============================================================

delays = delays.dropna(
    subset=[
        "actual_departure_delay_min",
        "departure_hour",
        "weekday",
    ]
).copy()


# ============================================================
# HISTORICAL DELAY PROFILE
# ============================================================

delay_profile = (
    delays
    .groupby(
        [
            "departure_hour",
            "weekday",
        ]
    )[
        "actual_departure_delay_min"
    ]
    .agg(
        expected_delay="mean",
        median_delay="median",
        delay_std="std",
        delay_samples="count",
    )
    .reset_index()
)


print("\nHistorical delay profile created.")

print(
    f"Delay profile rows: "
    f"{len(delay_profile)}"
)


# ============================================================
# MERGE DELAY PROFILE WITH TRIPS
# ============================================================

trips = trips.merge(
    delay_profile,
    left_on=[
        "departure_hour",
        "day_of_week",
    ],
    right_on=[
        "departure_hour",
        "weekday",
    ],
    how="left",
)


# ============================================================
# REMOVE EXTRA COLUMN
# ============================================================

if "weekday" in trips.columns:

    trips = trips.drop(
        columns=["weekday"]
    )


# ============================================================
# HANDLE MISSING DELAY PROFILE
# ============================================================

overall_delay = (
    delays[
        "actual_departure_delay_min"
    ].mean()
)

if pd.isna(overall_delay):

    overall_delay = 0.0


trips["expected_delay"] = (
    trips["expected_delay"]
    .fillna(overall_delay)
)

trips["median_delay"] = (
    trips["median_delay"]
    .fillna(overall_delay)
)

trips["delay_std"] = (
    trips["delay_std"]
    .fillna(0)
)

trips["delay_samples"] = (
    trips["delay_samples"]
    .fillna(0)
)


# ============================================================
# CREATE SCHEDULE ACTION
# ============================================================
#
# Historical expected delay determines the action.
#
# 0 -> Maintain
# 1 -> Shift Earlier
# 2 -> Shift Later
#
# Logic:
#
# Delay < 5 min
#       -> Maintain
#
# Delay 5-10 min
#       -> Shift Earlier
#
# Delay > 10 min
#       -> Shift Later
#
# ============================================================

def determine_schedule_action(delay):

    if delay < 5:

        return 0

    elif delay <= 10:

        return 1

    else:

        return 2


trips["schedule_action"] = (
    trips["expected_delay"]
    .apply(determine_schedule_action)
)


# ============================================================
# ACTION LABEL
# ============================================================

action_mapping = {
    0: "Maintain",
    1: "Shift Earlier",
    2: "Shift Later",
}

trips["schedule_action_label"] = (
    trips["schedule_action"]
    .map(action_mapping)
)


# ============================================================
# FINAL TRAINING COLUMNS
# ============================================================

training_columns = [

    # Route information
    "origin_station",
    "destination_station",

    # Trip characteristics
    "distance_km",
    "average_speed_kmh",
    "trip_duration_min",
    "speed_efficiency",

    # Time
    "departure_hour",
    "departure_minute",
    "departure_minute_of_day",

    # Calendar
    "day",
    "day_of_week",
    "month",
    "is_weekend",

    # Peak
    "peak_hour",

    # Historical operational information
    "expected_delay",
    "median_delay",
    "delay_std",
    "delay_samples",

    # Target
    "schedule_action",
    "schedule_action_label",
]


trips = trips[
    training_columns
].copy()


# ============================================================
# FINAL VALIDATION
# ============================================================

print("\n" + "=" * 60)
print("FINAL DATASET")
print("=" * 60)

print(
    f"Final Dataset Shape: "
    f"{trips.shape}"
)

print("\nFinal Columns:")

for column in trips.columns:

    print(f"  ✓ {column}")


print("\nMissing Values:")

print(
    trips.isnull().sum()
)


# ============================================================
# TARGET DISTRIBUTION
# ============================================================

print("\n" + "=" * 60)
print("SCHEDULE ACTION DISTRIBUTION")
print("=" * 60)

print(
    trips[
        "schedule_action"
    ].value_counts()
    .sort_index()
)


print("\nAction Labels:")

print(
    trips[
        "schedule_action_label"
    ].value_counts()
)


# ============================================================
# DELAY STATISTICS
# ============================================================

print("\n" + "=" * 60)
print("EXPECTED DELAY STATISTICS")
print("=" * 60)

print(
    trips[
        "expected_delay"
    ].describe()
)


# ============================================================
# SAVE
# ============================================================

trips.to_csv(
    OUTPUT_FILE,
    index=False,
)


print("\n" + "=" * 60)
print("SCHEDULE PREPROCESSING COMPLETED")
print("=" * 60)

print(
    f"Saved to:\n{OUTPUT_FILE}"
)