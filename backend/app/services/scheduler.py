import os
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


def recommend_schedule(source, destination):

    source_data = df[df["Station Name"] == source]
    destination_data = df[df["Station Name"] == destination]

    if source_data.empty:
        return {"error": "Source station not found"}

    if destination_data.empty:
        return {"error": "Destination station not found"}

    source_data = source_data.iloc[0]
    destination_data = destination_data.iloc[0]

    distance = abs(
        destination_data["Distance from Start (km)"] -
        source_data["Distance from Start (km)"]
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

        "distance_km": round(distance,2),

        "estimated_travel_time": f"{travel_time} Minutes",

        "recommended_frequency": frequency
    }