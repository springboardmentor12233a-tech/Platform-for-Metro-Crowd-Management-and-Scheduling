import pandas as pd
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.trip_record import TripRecord

CSV_PATH = "../datasets/raw/delhi_metro_updated.csv"


def import_trip_records():
    db: Session = SessionLocal()

    # Read CSV
    df = pd.read_csv(CSV_PATH)

    print(f"Total Rows in CSV: {len(df)}")

    # Fill missing values
    df["Passengers"] = df["Passengers"].fillna(0)
    df["Fare"] = df["Fare"].fillna(0)
    df["Cost_per_passenger"] = df["Cost_per_passenger"].fillna(0)
    df["Remarks"] = df["Remarks"].fillna("")
    df["Ticket_Type"] = df["Ticket_Type"].fillna("Unknown")

    # Clear existing data
    db.query(TripRecord).delete()
    db.commit()

    count = 0

    for _, row in df.iterrows():

        trip = TripRecord(
            trip_id=int(row["TripID"]) if pd.notna(row["TripID"]) else 0,
            trip_date=str(row["Date"]) if pd.notna(row["Date"]) else "",
            from_station=str(row["From_Station"]) if pd.notna(row["From_Station"]) else "",
            to_station=str(row["To_Station"]) if pd.notna(row["To_Station"]) else "",
            distance_km=float(row["Distance_km"]) if pd.notna(row["Distance_km"]) else 0.0,
            fare=float(row["Fare"]) if pd.notna(row["Fare"]) else 0.0,
            cost_per_passenger=float(row["Cost_per_passenger"]) if pd.notna(row["Cost_per_passenger"]) else 0.0,
            passengers=int(row["Passengers"]) if pd.notna(row["Passengers"]) else 0,
            ticket_type=str(row["Ticket_Type"]) if pd.notna(row["Ticket_Type"]) else "Unknown",
            remarks=str(row["Remarks"]) if pd.notna(row["Remarks"]) else "",
        )

        db.add(trip)
        count += 1

        # Commit every 500 records
        if count % 500 == 0:
            db.commit()
            print(f"{count} records imported...")

    db.commit()

    print(f"\n✅ Successfully imported {count} trip records!")

    db.close()


if __name__ == "__main__":
    import_trip_records()