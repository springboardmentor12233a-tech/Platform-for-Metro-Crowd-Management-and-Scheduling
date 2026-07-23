import uuid
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import Station, User, Schedule, CrowdMetric, Alert, AuditLog
from app.core.security import get_password_hash

# Set seed for reproducible synthetic data
random.seed(42)

STATIONS_DATA = [
    {"name": "Central Hub", "code": "HUB", "capacity": 5000, "latitude": 40.7128, "longitude": -74.0060},
    {"name": "North Terminal", "code": "NTH", "capacity": 3000, "latitude": 40.7589, "longitude": -73.9851},
    {"name": "Airport Station", "code": "APT", "capacity": 4000, "latitude": 40.6413, "longitude": -73.7781},
    {"name": "Financial District", "code": "FID", "capacity": 4500, "latitude": 40.7074, "longitude": -74.0113},
    {"name": "Tech Park", "code": "TEC", "capacity": 3500, "latitude": 40.7259, "longitude": -73.9967},
    {"name": "University City", "code": "UNI", "capacity": 2500, "latitude": 40.7308, "longitude": -73.9973},
    {"name": "Old Town", "code": "OLD", "capacity": 2000, "latitude": 40.7186, "longitude": -74.0048},
    {"name": "South Terminal", "code": "STH", "capacity": 3000, "latitude": 40.6895, "longitude": -74.0165},
]

def seed_db(db: Session):
    # Check if already seeded
    if db.query(Station).count() > 0:
        print("Database already seeded.")
        return

    print("Seeding stations...")
    stations = []
    station_map = {}
    for st in STATIONS_DATA:
        station = Station(
            id=uuid.uuid4(),
            name=st["name"],
            code=st["code"],
            capacity=st["capacity"],
            latitude=st["latitude"],
            longitude=st["longitude"],
            status="Active"
        )
        db.add(station)
        stations.append(station)
        station_map[st["code"]] = station
    
    db.commit()

    print("Seeding users...")
    users = [
        User(
            id=uuid.uuid4(),
            username="admin",
            email="admin@metroflow.com",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        ),
        User(
            id=uuid.uuid4(),
            username="operator",
            email="operator@metroflow.com",
            hashed_password=get_password_hash("operator123"),
            role="operator"
        ),
        User(
            id=uuid.uuid4(),
            username="passenger",
            email="passenger@metroflow.com",
            hashed_password=get_password_hash("passenger123"),
            role="passenger"
        ),
        User(
            id=uuid.uuid4(),
            username="master_hub",
            email="hub_master@metroflow.com",
            hashed_password=get_password_hash("master123"),
            role="station_master",
            station_id=station_map["HUB"].id
        ),
        User(
            id=uuid.uuid4(),
            username="master_fid",
            email="fid_master@metroflow.com",
            hashed_password=get_password_hash("master123"),
            role="station_master",
            station_id=station_map["FID"].id
        ),
    ]
    for u in users:
        db.add(u)
    db.commit()

    print("Seeding crowd metrics (last 24 hours, hourly logs)...")
    now = datetime.utcnow()
    weathers = ["Clear", "Rainy", "Snowy", "Stormy"]
    
    for station in stations:
        capacity = station.capacity
        for h in range(24, 0, -1):
            log_time = now - timedelta(hours=h)
            hour = log_time.hour
            day_of_week = log_time.weekday()
            
            # Define peak hour patterns
            # Morning peak: 8 AM - 10 AM (Commuting in)
            # Evening peak: 5 PM - 7 PM (Commuting out)
            is_peak = (8 <= hour <= 10) or (17 <= hour <= 19)
            is_weekend = day_of_week >= 5

            # Base factor
            if is_weekend:
                base_factor = 0.2
                if 12 <= hour <= 16:  # mid day weekend bump
                    base_factor = 0.4
            else:
                base_factor = 0.15
                if is_peak:
                    base_factor = 0.75
                elif 11 <= hour <= 16:
                    base_factor = 0.4

            # Specific stations have different peaks
            # Airport (APT) has flat random peaks
            if station.code == "APT":
                base_factor = random.uniform(0.3, 0.6)
            # Financial District (FID) and Tech Park (TEC) have heavy business peaks
            elif station.code in ["FID", "TEC"] and is_peak:
                base_factor = 0.85 if hour in [9, 17, 18] else 0.7

            # Add random noise
            noise = random.uniform(-0.08, 0.08)
            occupancy_percent = min(max(base_factor + noise, 0.05), 0.95)
            
            passenger_count = int(capacity * occupancy_percent)
            
            # Generate inflow/outflow
            if is_weekend:
                inflow = int(passenger_count * random.uniform(0.05, 0.12))
            else:
                if hour in [8, 9, 10]: # morning inflow peak
                    inflow = int(passenger_count * random.uniform(0.15, 0.25))
                elif hour in [17, 18, 19]: # evening outflow peak
                    inflow = int(passenger_count * random.uniform(0.05, 0.12))
                else:
                    inflow = int(passenger_count * random.uniform(0.08, 0.15))
            
            outflow = max(int(passenger_count * random.uniform(0.05, 0.15)), 5)

            weather = random.choices(weathers, weights=[0.75, 0.15, 0.08, 0.02])[0]
            is_special = random.random() < 0.05 # 5% chance of special event
            is_hol = day_of_week == 6 # Sunday is holiday for simplicity

            metric = CrowdMetric(
                id=uuid.uuid4(),
                station_id=station.id,
                passenger_count=passenger_count,
                inflow_rate=inflow,
                outflow_rate=outflow,
                weather=weather,
                is_special_event=is_special,
                is_holiday=is_hol,
                recorded_at=log_time
            )
            db.add(metric)
    db.commit()

    print("Seeding schedules (today)...")
    lines = [
        {"name": "Red Line", "route": ["NTH", "FID", "HUB", "OLD", "STH"]},
        {"name": "Blue Line", "route": ["APT", "TEC", "HUB", "UNI", "STH"]}
    ]
    
    # Let's seed 15 schedules for today
    today_start = datetime.utcnow().replace(hour=6, minute=0, second=0, microsecond=0)
    
    for i in range(15):
        line = random.choice(lines)
        route = line["route"]
        line_name = line["name"]
        
        # Select departure & arrival stations
        dep_code = route[0]
        arr_code = route[-1]
        
        dep_station = station_map[dep_code]
        arr_station = station_map[arr_code]
        
        # Spread departure times
        sch_dep = today_start + timedelta(hours=i, minutes=random.randint(0, 45))
        sch_arr = sch_dep + timedelta(minutes=45) # 45 minutes travel time
        
        # Decide status
        status = "Scheduled"
        act_dep = None
        act_arr = None
        
        if sch_dep < now:
            # Completed or Delayed
            if random.random() < 0.15:
                status = "Delayed"
                act_dep = sch_dep + timedelta(minutes=random.randint(10, 25))
                act_arr = sch_arr + timedelta(minutes=random.randint(10, 25))
            else:
                status = "Completed"
                act_dep = sch_dep + timedelta(minutes=random.randint(-2, 3))
                act_arr = sch_arr + timedelta(minutes=random.randint(-2, 5))
        
        schedule = Schedule(
            id=uuid.uuid4(),
            train_id=f"T-{100 + i}",
            line_name=line_name,
            direction="Inbound" if i % 2 == 0 else "Outbound",
            departure_station_id=dep_station.id,
            arrival_station_id=arr_station.id,
            scheduled_departure=sch_dep,
            scheduled_arrival=sch_arr,
            actual_departure=act_dep,
            actual_arrival=act_arr,
            status=status
        )
        db.add(schedule)
    db.commit()

    print("Seeding alerts...")
    # Active critical alert
    hub_station = station_map["HUB"]
    active_alert = Alert(
        id=uuid.uuid4(),
        station_id=hub_station.id,
        severity="Critical",
        description="Central Hub is experiencing extreme passenger volume at Platform 1. Occupancy at 91%.",
        status="Active",
        triggered_at=now - timedelta(minutes=15)
    )
    db.add(active_alert)
    
    # Resolved warning alert
    fid_station = station_map["FID"]
    resolved_alert = Alert(
        id=uuid.uuid4(),
        station_id=fid_station.id,
        severity="Warning",
        description="Escalator outage at Financial District causing minor congestion.",
        status="Resolved",
        triggered_at=now - timedelta(hours=3),
        resolved_at=now - timedelta(hours=1),
        resolved_by=db.query(User).filter(User.username == "operator").first().id
    )
    db.add(resolved_alert)
    db.commit()

    # Log initial audits
    db.add(AuditLog(
        id=uuid.uuid4(),
        action="SYSTEM_INIT",
        details="Database initialized and default seed data loaded.",
        created_at=datetime.utcnow()
    ))
    db.commit()
    print("Database seeding completed successfully.")

def init_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
    
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_tables()
