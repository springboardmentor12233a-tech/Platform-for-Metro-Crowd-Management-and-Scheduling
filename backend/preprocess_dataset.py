from pathlib import Path
import pandas as pd
import numpy as np


# ============================================================
# PATHS
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent

DATASET_DIR = PROJECT_DIR / "dataset"

PASSENGER_DATASET = DATASET_DIR / "delhi_metro_updated.csv"
NETWORK_DATASET = DATASET_DIR / "Delhi-Metro-Network.csv"

OUTPUT_DIR = BACKEND_DIR / "data"
OUTPUT_FILE = OUTPUT_DIR / "processed_station_demand.csv"


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("METROFLOW DATASET PREPROCESSING")
print("=" * 60)

print("\nLoading passenger dataset...")

df = pd.read_csv(PASSENGER_DATASET)

print("Passenger records:", len(df))

print("\nLoading network dataset...")

network = pd.read_csv(NETWORK_DATASET)

print("Network records:", len(network))


# ============================================================
# CLEAN COLUMN NAMES
# ============================================================

df.columns = df.columns.str.strip()
network.columns = network.columns.str.strip()


# ============================================================
# CLEAN PASSENGER DATA
# ============================================================

df["Date"] = pd.to_datetime(
    df["Date"],
    errors="coerce"
)

df["Passengers"] = pd.to_numeric(
    df["Passengers"],
    errors="coerce"
)

df = df.dropna(
    subset=[
        "Date",
        "From_Station",
        "Passengers"
    ]
)


# ============================================================
# STATION NAME NORMALIZATION
# ============================================================

def normalize_name(name):

    if pd.isna(name):
        return None

    name = str(name).strip()

    name = " ".join(name.split())

    return name.lower()


# ============================================================
# CANONICAL STATION MAPPING
# ============================================================

station_mapping = {

    # Direct / renamed stations
    "barakhamba road": "barakhamba",

    "central secretariat":
        "central secretariat",

    "hauz khas":
        "hauz khas",

    "inderlok":
        "inderlok",

    "janakpuri west":
        "janak puri west",

    "jasola vihar":
        "jasola vihar shaheen bagh",

    "kalkaji mandir":
        "kalkaji mandir",

    "kashmere gate":
        "kashmere gate",

    "kirti nagar":
        "kirti nagar",

    "mandi house":
        "mandi house",

    "netaji subhash place":
        "netaji subash place",

    "new delhi":
        "new delhi",

    "noida city centre":
        "noida city center",

    "pragati maidan":
        "supreme court (pragati maidan)",

    "rajiv chowk":
        "rajiv chowk",

    "rajouri garden":
        "rajouri garden",

    "aiims":
        "aiims",

    "model town":
        "model town",

    "chandni chowk":
        "chandni chowk",

    "dilshad garden":
        "dilshad garden",

    "laxmi nagar":
        "laxmi nagar",

    "punjabi bagh":
        "punjabi bagh",

    "shivaji park":
        "shivaji park",

    "old delhi":
        None
}


# ============================================================
# NORMALIZE PASSENGER STATION
# ============================================================

df["station_original"] = df["From_Station"]

df["station_key"] = (
    df["From_Station"]
    .apply(normalize_name)
)


df["network_key"] = df["station_key"].map(
    station_mapping
)


# ============================================================
# NORMALIZE NETWORK STATIONS
# ============================================================

def get_base_network_station(name):

    if pd.isna(name):
        return None

    name = str(name).strip().lower()

    # Remove connection information
    if "[conn:" in name:
        name = name.split("[conn:")[0].strip()

    if "conn:" in name:
        name = name.split("conn:")[0].strip()

    return name


network["network_key"] = (
    network["Station Name"]
    .apply(get_base_network_station)
)


# ============================================================
# CREATE NETWORK INFORMATION
# ============================================================

network["Line"] = network["Line"].fillna("Unknown")


def combine_unique(values):

    values = [
        str(v).strip()
        for v in values
        if pd.notna(v)
        and str(v).strip()
    ]

    values = list(dict.fromkeys(values))

    return " / ".join(values)


network_grouped = (
    network
    .groupby("network_key")
    .agg(
        station_name=(
            "Station Name",
            "first"
        ),

        line=(
            "Line",
            combine_unique
        ),

        latitude=(
            "Latitude",
            "first"
        ),

        longitude=(
            "Longitude",
            "first"
        )
    )
    .reset_index()
)


# ============================================================
# CREATE DAILY STATION DEMAND
# ============================================================

print("\nCreating daily station demand...")


daily = (
    df
    .groupby(
        [
            "Date",
            "network_key"
        ],
        as_index=False
    )["Passengers"]
    .sum()
)


daily = daily.rename(
    columns={
        "Passengers":
            "passenger_demand"
    }
)


# ============================================================
# DATE FEATURES
# ============================================================

daily["day_of_week"] = (
    daily["Date"].dt.dayofweek
)

daily["day"] = (
    daily["Date"].dt.day
)

daily["month"] = (
    daily["Date"].dt.month
)

daily["year"] = (
    daily["Date"].dt.year
)

daily["is_weekend"] = (
    daily["day_of_week"] >= 5
).astype(int)

daily["day_type"] = np.where(
    daily["is_weekend"] == 1,
    "Weekend",
    "Weekday"
)


# ============================================================
# CROWD THRESHOLDS
# ============================================================

thresholds = (
    daily
    .groupby(
        "network_key"
    )["passenger_demand"]
    .quantile(
        [
            0.50,
            0.80,
            0.90
        ]
    )
    .unstack()
)


thresholds.columns = [
    "median_demand",
    "p80_demand",
    "p90_demand"
]


daily = daily.merge(
    thresholds,
    on="network_key",
    how="left"
)


# ============================================================
# CROWD LEVEL
# ============================================================

def calculate_crowd(row):

    demand = row["passenger_demand"]

    if demand > row["p80_demand"]:
        return "High"

    elif demand >= row["median_demand"]:
        return "Medium"

    return "Low"


daily["crowd_level"] = daily.apply(
    calculate_crowd,
    axis=1
)


# ============================================================
# MERGE NETWORK INFORMATION
# ============================================================

daily = daily.merge(
    network_grouped,
    on="network_key",
    how="left"
)


# ============================================================
# HANDLE OLD DELHI
# ============================================================

daily.loc[
    daily["network_key"].isna(),
    "station_name"
] = daily.loc[
    daily["network_key"].isna(),
    "network_key"
]


# ============================================================
# CLEAN STATION DISPLAY NAME
# ============================================================

daily["station"] = daily["network_key"]


# Make names readable
daily["station"] = (
    daily["station"]
    .str.title()
)


# Correct known names
display_names = {

    "Aiims":
        "AIIMS",

    "Barakhamba":
        "Barakhamba Road",

    "Janak Puri West":
        "Janakpuri West",

    "Noida City Center":
        "Noida City Centre",

    "Netaji Subash Place":
        "Netaji Subhash Place",

    "Supreme Court (Pragati Maidan)":
        "Pragati Maidan",

    "Jasola Vihar Shaheen Bagh":
        "Jasola Vihar"

}


daily["station"] = (
    daily["station"]
    .replace(display_names)
)


# ============================================================
# FINAL COLUMNS
# ============================================================

final_columns = [

    "Date",

    "station",

    "passenger_demand",

    "day_of_week",

    "day",

    "month",

    "year",

    "is_weekend",

    "day_type",

    "median_demand",

    "p80_demand",

    "p90_demand",

    "crowd_level",

    "line",

    "latitude",

    "longitude"

]


daily = daily[
    final_columns
]


# ============================================================
# SAVE
# ============================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


daily = daily.sort_values(
    [
        "Date",
        "station"
    ]
)


daily.to_csv(
    OUTPUT_FILE,
    index=False
)


# ============================================================
# REPORT
# ============================================================

print("\n")
print("=" * 60)
print("PREPROCESSING COMPLETED")
print("=" * 60)

print(
    "\nProcessed rows:",
    len(daily)
)

print(
    "Unique stations:",
    daily["station"].nunique()
)

print(
    "\nStations:"
)

print(
    sorted(
        daily["station"].unique()
    )
)

print(
    "\nMissing coordinates:",
    daily["latitude"].isna().sum()
)

print(
    "Unknown lines:",
    (daily["line"] == "Unknown").sum()
)

print(
    "\nCrowd distribution:"
)

print(
    daily["crowd_level"].value_counts()
)

print(
    "\nSaved to:"
)

print(
    OUTPUT_FILE
)

print("\nDone.")