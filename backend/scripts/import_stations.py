import pandas as pd
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.station import Station

CSV_PATH = "../datasets/raw/Delhi-Metro-Network.csv"


def import_stations():
    db: Session = SessionLocal()

    # Read CSV
    df = pd.read_csv(CSV_PATH)

    # Clear old data (if any)
    db.query(Station).delete()
    db.commit()

    count = 0

    for _, row in df.iterrows():

        station = Station(
            station_name=row["Station Name"],
            line=row["Line"],
            distance_from_start=row["Distance from Start (km)"],
            opening_date=row["Opening Date"],
            station_layout=row["Station Layout"],
            latitude=row["Latitude"],
            longitude=row["Longitude"],
            capacity=2000
        )

        db.add(station)
        count += 1

    db.commit()

    print(f"\n✅ Successfully imported {count} stations!")

    db.close()


if __name__ == "__main__":
    import_stations()