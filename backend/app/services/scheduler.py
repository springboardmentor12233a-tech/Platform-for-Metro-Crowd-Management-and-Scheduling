import os
import re
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET = os.path.join(
    BASE_DIR,
    "..",
    "..",
    "..",
    "dataset",
    "Delhi-Metro-Network.csv"
)

DATASET = os.path.abspath(DATASET)

df = pd.read_csv(DATASET)


def normalize_station_name(name):
    name = str(name).strip().lower()

    # Remove connection information
    # Example:
    # Netaji Subash Place [Conn: Red]
    # becomes:
    # Netaji Subash Place
    name = re.sub(r"\s*\[conn:.*?\]", "", name)

    # Handle naming differences
    replacements = {
        "subash": "subhash",
        "noida city center": "noida city centre",
        "janak puri west": "janakpuri west",
        "barakhamba": "barakhamba road",
    }

    name = replacements.get(name, name)

    # Remove extra spaces
    name = re.sub(r"\s+", " ", name).strip()

    return name


# Create normalized station names
df["Normalized Station"] = df["Station Name"].apply(
    normalize_station_name
)


def find_station(station_name):

    normalized_name = normalize_station_name(
        station_name
    )

    matches = df[
        df["Normalized Station"] == normalized_name
    ]

    if matches.empty:
        return None

    return matches.iloc[0]


def recommend_schedule(source, destination):

    source_data = find_station(source)
    destination_data = find_station(destination)

    if source_data is None:
        return {
            "error": f"Source station not found: {source}"
        }

    if destination_data is None:
        return {
            "error": f"Destination station not found: {destination}"
        }

    source_distance = float(
        source_data["Distance from Start (km)"]
    )

    destination_distance = float(
        destination_data["Distance from Start (km)"]
    )

    distance = abs(
        destination_distance - source_distance
    )

    travel_time = round(distance * 2)

    if distance < 10:
        frequency = "Every 3 Minutes"

    elif distance < 20:
        frequency = "Every 5 Minutes"

    else:
        frequency = "Every 8 Minutes"

    return {
        "source": source,
        "destination": destination,
        "line": source_data["Line"],
        "distance_km": round(distance, 2),
        "estimated_travel_time": f"{travel_time} Minutes",
        "recommended_frequency": frequency
    }