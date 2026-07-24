import os
import sys
import pandas as pd

# Add backend folder to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.postgres import SessionLocal
from app.models.station import Station

db = SessionLocal()

# Project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Path to cleaned dataset
csv_path = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "EDA",
        "cleaned_data",
        "delhi_metro_network_clean.csv"
    )
)

print("Reading CSV from:", csv_path)

df = pd.read_csv(csv_path)

inserted = 0
skipped = 0

for _, row in df.iterrows():

    existing = db.query(Station).filter(
        Station.station_name == row["Station Name"]
    ).first()

    if existing:
        skipped += 1
        continue

    station = Station(
        station_name=row["Station Name"],
        line_name=row["Line"],
        distance_from_start=row["Distance from Start (km)"],
        opening_date=pd.to_datetime(row["Opening Date"]).date(),
        station_layout=row["Station Layout"],
        latitude=row["Latitude"],
        longitude=row["Longitude"],
        is_interchange=False
    )

    db.add(station)
    inserted += 1

db.commit()

print("=" * 40)
print(f"Inserted Stations : {inserted}")
print(f"Skipped Stations  : {skipped}")
print("=" * 40)

db.close()