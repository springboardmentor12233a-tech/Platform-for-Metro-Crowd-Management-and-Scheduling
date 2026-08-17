from datetime import datetime
from pathlib import Path
import hashlib

import pandas as pd
from sqlalchemy.orm import Session

from app.auth import get_password_hash
from app.config import settings
from app.models import Alert, EmergencyAnnouncement, OperationalUpdate, PassengerFlow, Station, TrainSchedule, User


DEFAULT_USERS = [
    {
        "username": "admin",
        "full_name": "MetroFlow Admin",
        "role": "admin",
        "assigned_station": None,
        "password": "admin123",
    },
    {
        "username": "operator",
        "full_name": "Station Operator",
        "role": "operator",
        "assigned_station": "Rajiv Chowk",
        "password": "operator123",
    },
]

LINES = ["Blue Line", "Yellow Line", "Violet Line", "Magenta Line", "Pink Line", "Airport Express"]


def _stable_number(text: str, start: int, width: int) -> int:
    digest = hashlib.sha1(text.encode("utf-8")).hexdigest()
    return start + int(digest[:6], 16) % width


def _stable_capacity(station_name: str) -> int:
    # Demo-friendly capacities are intentionally smaller than real station capacity so that the dashboard
    # can demonstrate Low, Moderate, High and Overcrowded status levels during Milestone 3.
    return _stable_number(station_name, 80, 170)


def _stable_line(station_name: str) -> str:
    return LINES[_stable_number(station_name, 0, len(LINES)) % len(LINES)]


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
            assigned_station=user_data["assigned_station"],
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
        station = Station(name=name, line=_stable_line(name), capacity=_stable_capacity(name))
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


def seed_schedules(db: Session) -> None:
    if db.query(TrainSchedule).first():
        return

    station_names = [name for (name,) in db.query(Station.name).order_by(Station.name).limit(24).all()]
    if len(station_names) < 2:
        return

    demo_routes = []
    for index in range(12):
        source = station_names[index % len(station_names)]
        destination = station_names[(index + 7) % len(station_names)]
        line = _stable_line(source)
        hour = 6 + index
        minute = (index * 7) % 60
        duration = 22 + (index * 3) % 28
        arrival_hour = hour + ((minute + duration) // 60)
        arrival_minute = (minute + duration) % 60
        load = 80 + (index * 37) % 260
        frequency = 4 if load > 260 else 6 if load > 180 else 8
        delay = [0, 0, 2, 5, 0, 8, 0, 3, 0, 12, 0, 4][index]
        status = "Delayed" if delay else "On Time"
        demo_routes.append(
            TrainSchedule(
                train_number=f"MF-{101 + index}",
                line=line,
                source_station=source,
                destination_station=destination,
                departure_time=f"{hour:02d}:{minute:02d}",
                arrival_time=f"{arrival_hour:02d}:{arrival_minute:02d}",
                frequency_minutes=frequency,
                recommended_frequency=max(3, frequency - 1 if load > 220 else frequency),
                expected_load=load,
                delay_minutes=delay,
                status=status,
            )
        )
    db.add_all(demo_routes)
    db.commit()


def seed_alerts_and_updates(db: Session) -> None:
    if not db.query(Alert).first():
        db.add_all(
            [
                Alert(
                    title="Peak crowd monitoring required",
                    station_name="Rajiv Chowk",
                    severity="High",
                    category="crowd",
                    message="Passenger volume trend indicates higher station load. Increase platform monitoring and review train frequency.",
                ),
                Alert(
                    title="Schedule delay watch",
                    station_name="Central Secretariat",
                    severity="Moderate",
                    category="delay",
                    message="Delay reported on a connected route. Operators should communicate expected wait time to passengers.",
                ),
            ]
        )
    if not db.query(EmergencyAnnouncement).first():
        db.add(
            EmergencyAnnouncement(
                title="Safety announcement demo",
                message="Please follow platform guidance and avoid crowding near train doors during peak movement.",
                target_station="All Stations",
                priority="Normal",
                created_by="admin",
            )
        )
    if not db.query(OperationalUpdate).first():
        db.add_all(
            [
                OperationalUpdate(
                    update_type="schedule",
                    line="Blue Line",
                    station_name="Rajiv Chowk",
                    message="Additional monitoring recommended for evening peak traffic.",
                    status="Open",
                ),
                OperationalUpdate(
                    update_type="crowd",
                    line="Yellow Line",
                    station_name="Central Secretariat",
                    message="Station staff assigned to support crowd movement during high passenger flow.",
                    status="Open",
                ),
            ]
        )
    db.commit()


def seed_database(db: Session) -> None:
    seed_users(db)
    seed_dataset(db)
    seed_schedules(db)
    seed_alerts_and_updates(db)
