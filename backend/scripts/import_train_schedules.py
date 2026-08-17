from pathlib import Path
import pandas as pd
from datetime import datetime

from app.database.database import SessionLocal
from app.models.train_schedule import TrainSchedule


# MetroVision project root
BASE_DIR = Path(__file__).resolve().parents[2]

CSV_PATH = (
    BASE_DIR
    / "datasets"
    / "raw"
    / "train_schedules.csv"
)


def import_train_schedules():
    print(f"Reading CSV: {CSV_PATH}")

    if not CSV_PATH.exists():
        print(f"ERROR: CSV not found: {CSV_PATH}")
        return

    db = SessionLocal()

    try:
        df = pd.read_csv(CSV_PATH)

        print(f"Found {len(df)} schedule records.")

        # Remove existing imported schedules
        db.query(TrainSchedule).delete()

        for _, row in df.iterrows():
            schedule = TrainSchedule(
                train_id=str(row["train_id"]).strip(),
                line=str(row["line"]).strip(),
                from_station=str(row["from_station"]).strip(),
                to_station=str(row["to_station"]).strip(),
                departure_time=datetime.strptime(
                    str(row["departure_time"]).strip(),
                    "%H:%M",
                ).time(),
                arrival_time=datetime.strptime(
                    str(row["arrival_time"]).strip(),
                    "%H:%M",
                ).time(),
                platform=str(row["platform"]).strip(),
                status=str(row["status"]).strip(),
                ai_suggestion=(
                    str(row["ai_suggestion"]).strip()
                    if pd.notna(row["ai_suggestion"])
                    else None
                ),
            )

            db.add(schedule)

        db.commit()

        print(
            f"Successfully imported {len(df)} train schedules."
        )

    except Exception as e:
        db.rollback()
        print(f"Import failed: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    import_train_schedules()