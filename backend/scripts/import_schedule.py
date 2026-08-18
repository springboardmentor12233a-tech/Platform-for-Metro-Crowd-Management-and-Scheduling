import pandas as pd
from pathlib import Path
from sqlalchemy import text

from app.database import engine


# ------------------------------------------------
# CSV PATH
# ------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

CSV_PATH = BASE_DIR / "datasets" / "raw" / "schedule.csv"


# ------------------------------------------------
# Import schedules
# ------------------------------------------------

def import_schedules():

    print(f"Reading CSV from: {CSV_PATH}")

    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"CSV file not found: {CSV_PATH}"
        )

    df = pd.read_csv(CSV_PATH)

    print(f"Found {len(df)} schedules in CSV.")

    # ------------------------------------------------
    # Validate columns
    # ------------------------------------------------

    required_columns = [
        "train_id",
        "line",
        "from_station",
        "to_station",
        "departure_time",
        "arrival_time",
        "platform",
        "status",
        "ai_suggestion",
    ]

    missing = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing columns in CSV: {missing}"
        )

    # ------------------------------------------------
    # PostgreSQL UPSERT
    # ------------------------------------------------

    query = text("""
        INSERT INTO train_schedules (
            train_id,
            line,
            from_station,
            to_station,
            departure_time,
            arrival_time,
            platform,
            status,
            ai_suggestion
        )
        VALUES (
            :train_id,
            :line,
            :from_station,
            :to_station,
            :departure_time,
            :arrival_time,
            :platform,
            :status,
            :ai_suggestion
        )

        ON CONFLICT (train_id)
        DO UPDATE SET
            line = EXCLUDED.line,
            from_station = EXCLUDED.from_station,
            to_station = EXCLUDED.to_station,
            departure_time = EXCLUDED.departure_time,
            arrival_time = EXCLUDED.arrival_time,
            platform = EXCLUDED.platform,
            status = EXCLUDED.status,
            ai_suggestion = EXCLUDED.ai_suggestion;
    """)

    # ------------------------------------------------
    # Insert into PostgreSQL
    # ------------------------------------------------

    with engine.begin() as connection:

        for _, row in df.iterrows():

            connection.execute(
                query,
                {
                    "train_id": row["train_id"],
                    "line": row["line"],
                    "from_station": row["from_station"],
                    "to_station": row["to_station"],
                    "departure_time": row["departure_time"],
                    "arrival_time": row["arrival_time"],
                    "platform": str(row["platform"]),
                    "status": row["status"],
                    "ai_suggestion": row["ai_suggestion"],
                }
            )

    print("Schedule data imported successfully.")


# ------------------------------------------------
# Run
# ------------------------------------------------

if __name__ == "__main__":
    import_schedules()