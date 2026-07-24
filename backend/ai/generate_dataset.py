import os
import random
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATION_DATASET = os.path.join(
    BASE_DIR,
    "..",
    "EDA",
    "cleaned_data",
    "delhi_metro_network_clean.csv"
)

OUTPUT_FOLDER = os.path.join(BASE_DIR, "ai", "datasets")

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

OUTPUT_FILE = os.path.join(
    OUTPUT_FOLDER,
    "synthetic_crowd_data.csv"
)

# -------------------------------------------------
# Load Stations
# -------------------------------------------------

stations_df = pd.read_csv(STATION_DATASET)

print("=" * 60)
print("Station Dataset Loaded Successfully")
print("=" * 60)

print(stations_df.head())

print("\nTotal Stations :", len(stations_df))

# -------------------------------------------------
# Create Station Profiles
# -------------------------------------------------

station_profiles = []

for _, row in stations_df.iterrows():

    station_name = row["Station Name"]
    line = row["Line"]
    distance = row["Distance from Start (km)"]

    # Detect interchange station
    is_interchange = "[" in station_name

    # Station popularity
    if is_interchange:
        popularity = random.randint(85, 100)

    elif distance < 5:
        popularity = random.randint(70, 85)

    elif distance > 40:
        popularity = random.randint(60, 75)

    else:
        popularity = random.randint(40, 65)

    station_profiles.append(
        {
            "station": station_name,
            "line": line,
            "distance": distance,
            "is_interchange": is_interchange,
            "popularity": popularity
        }
    )

print("\nStation Profiles Created Successfully")

print("\nSample Profiles\n")

for station in station_profiles[:10]:
    print(station)

    # -------------------------------------------------
# Passenger Count Generator
# -------------------------------------------------

def calculate_passengers(station, hour, weather, holiday, weekend):

    # Base passengers from station popularity
    passengers = station["popularity"] * 25

    # Peak hours
    if 7 <= hour <= 10:
        passengers += 900

    elif 17 <= hour <= 20:
        passengers += 1100

    elif hour >= 22 or hour <= 5:
        passengers -= 700

    # Weekend
    if weekend:
        passengers -= 250

    # Holiday
    if holiday:
        passengers -= 500

    # Weather effects
    if weather == "Rain":
        passengers += 150

    elif weather == "Heavy Rain":
        passengers -= 250

    elif weather == "Fog":
        passengers -= 180

    # Interchange bonus
    if station["is_interchange"]:
        passengers += 600

    # Random variation
    passengers += random.randint(-120, 120)

    return max(50, int(passengers))

# -------------------------------------------------
# Constants
# -------------------------------------------------

WEATHER_OPTIONS = [
    "Clear",
    "Rain",
    "Heavy Rain",
    "Fog"
]

TICKET_TYPES = [
    "Smart Card",
    "Token",
    "QR Ticket"
]

START_DATE = datetime(2024, 1, 1)

NUMBER_OF_RECORDS = 300000

# -------------------------------------------------
# Generate Synthetic Trips
# -------------------------------------------------

records = []

print("\nGenerating synthetic dataset...")

for i in range(NUMBER_OF_RECORDS):

    # Select random source station
    from_station = random.choice(station_profiles)

    # Select random destination station
    to_station = random.choice(station_profiles)

    # Ensure source and destination are different
    while from_station["station"] == to_station["station"]:
        to_station = random.choice(station_profiles)

    # Random date
    trip_date = START_DATE + timedelta(days=random.randint(0, 730))

    # Random hour
    hour = random.randint(5, 23)

    # Weekend
    weekend = trip_date.weekday() >= 5

    # Holiday (about 10% of records)
    holiday = random.random() < 0.10

    # Weather
    weather = random.choice(WEATHER_OPTIONS)

    # Ticket Type
    ticket_type = random.choice(TICKET_TYPES)

    # Distance between stations
    distance = abs(
        from_station["distance"] -
        to_station["distance"]
    )

    # Passenger Count
    passengers = calculate_passengers(
        from_station,
        hour,
        weather,
        holiday,
        weekend
    )

    records.append({
        "Date": trip_date.strftime("%Y-%m-%d"),
        "Hour": hour,
        "Day_Name": trip_date.strftime("%A"),
        "Month": trip_date.month,
        "Is_Holiday": int(holiday),
        "Weather": weather,
        "From_Station": from_station["station"],
        "To_Station": to_station["station"],
        "Distance_km": round(distance, 2),
        "Ticket_Type": ticket_type,
        "Is_Interchange": int(from_station["is_interchange"]),
        "Passenger_Count": passengers
    })

    if (i + 1) % 50000 == 0:
        print(f"{i+1} records generated...")

        # -------------------------------------------------
# Save Dataset
# -------------------------------------------------

dataset = pd.DataFrame(records)

dataset.to_csv(OUTPUT_FILE, index=False)

print("\nDataset Generated Successfully!")
print(f"Total Records : {len(dataset)}")
print(f"Saved To : {OUTPUT_FILE}")

print("\nSample Data")
print(dataset.head())