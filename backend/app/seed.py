from datetime import datetime
from pathlib import Path
import hashlib

import pandas as pd
from sqlalchemy.orm import Session

from app.auth import get_password_hash
from app.config import settings
from app.models import PassengerFlow, Station, User


DEFAULT_USERS = [
    {
        "username": "admin",
        "full_name": "MetroFlow Admin",
        "role": "admin",
        "password": "admin123",
    },
    {
        "username": "operator",
        "full_name": "Station Operator",
        "role": "operator",
        "password": "operator123",
    },
]


def _stable_capacity(station_name: str) -> int:
    digest = hashlib.sha1(station_name.encode("utf-8")).hexdigest()
    return 7000 + int(digest[:6], 16) % 13000


def _dataset_file() -> Path:
    current = Path(__file__).resolve()
    backend_folder = current.parents[1]
    return (backend_folder / "data" / "delhi_metro_updated.csv").resolve()


def seed_users(db: Session) -> None:
    for user_data in DEFAULT_USERS:
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        if existing:
            continue
        user = User(
            username=user_data["username"],
            full_name=user_data["full_name"],
            role=user_data["role"],
            hashed_password=get_password_hash(user_data["password"]),
        )
        db.add(user)
    db.commit()


def seed_dataset(db: Session) -> None:
    has_flows = db.query(PassengerFlow).first()
    if has_flows:
        return

    path = _dataset_file()
    if not path.exists():
        raise FileNotFoundError(f"Dataset file not found: {path}")

    df = pd.read_csv(path)
    df = df.dropna(subset=["Date", "From_Station", "To_Station", "Passengers"])
    df["From_Station"] = df["From_Station"].astype(str).str.strip()
    df["To_Station"] = df["To_Station"].astype(str).str.strip()
    df["Ticket_Type"] = df["Ticket_Type"].fillna("Unknown").astype(str).str.strip()
    df["Remarks"] = df["Remarks"].fillna("normal").astype(str).str.strip()
    df["Passengers"] = pd.to_numeric(df["Passengers"], errors="coerce").fillna(0)
    df["Distance_km"] = pd.to_numeric(df["Distance_km"], errors="coerce").fillna(0)
    df["Fare"] = pd.to_numeric(df["Fare"], errors="coerce").fillna(0)
    df["Cost_per_passenger"] = pd.to_numeric(df["Cost_per_passenger"], errors="coerce").fillna(0)

    if settings.MAX_IMPORT_ROWS > 0:
        df = df.head(settings.MAX_IMPORT_ROWS)

    station_names = sorted(set(df["From_Station"].unique()).union(set(df["To_Station"].unique())))
    station_map = {}
    for name in station_names:
        station = Station(name=name, line="Delhi Metro", capacity=_stable_capacity(name))
        db.add(station)
        db.flush()
        station_map[name] = station.id

    flows = []
    for row in df.itertuples(index=False):
        try:
            travel_date = datetime.strptime(str(row.Date), "%Y-%m-%d").date()
        except ValueError:
            continue

        flows.append(
            PassengerFlow(
                trip_id=int(row.TripID),
                travel_date=travel_date,
                from_station_id=station_map[str(row.From_Station).strip()],
                to_station_id=station_map[str(row.To_Station).strip()],
                distance_km=float(row.Distance_km),
                fare=float(row.Fare),
                cost_per_passenger=float(row.Cost_per_passenger),
                passengers=float(row.Passengers),
                ticket_type=str(row.Ticket_Type).strip() or "Unknown",
                remarks=str(row.Remarks).strip() or "normal",
            )
        )

        if len(flows) >= 1000:
            db.bulk_save_objects(flows)
            db.commit()
            flows.clear()

    if flows:
        db.bulk_save_objects(flows)
        db.commit()


def seed_database(db: Session) -> None:
    seed_users(db)
    seed_dataset(db)
