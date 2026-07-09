from .database import SessionLocal
from .models import StationCrowdData, TrafficPattern, PassengerDemandForecast, TrainOccupancy, AlertNotification, Station, Route, Trip
from datetime import datetime, timedelta
import random

db = SessionLocal()

# Get all stations and routes from database
stations = db.query(Station).all()
routes = db.query(Route).all()
trips = db.query(Trip).limit(100).all()

print(f"Found {len(stations)} stations, {len(routes)} routes, {len(trips)} trips")

# 1. GENERATE STATION CROWD DATA (last 7 days)
print("\n📊 Generating StationCrowdData...")
for i in range(len(stations)):
    station = stations[i]
    base_date = datetime.now() - timedelta(days=7)
    
    for day in range(7):
        current_date = base_date + timedelta(days=day)
        
        # Peak hours: 7-10am, 5-8pm
        for hour in range(24):
            if hour in [7, 8, 9, 17, 18, 19]:  # peak hours
                crowd_level = random.randint(4, 5)
                passenger_count = random.randint(500, 1500)
                capacity = 80 + random.randint(10, 20)
            else:
                crowd_level = random.randint(1, 3)
                passenger_count = random.randint(50, 300)
                capacity = 30 + random.randint(10, 30)
            
            timestamp = current_date.replace(hour=hour, minute=0, second=0)
            
            crowd_data = StationCrowdData(
                station_id=station.station_id,
                timestamp=timestamp,
                crowd_level=crowd_level,
                passenger_count=passenger_count,
                capacity_percentage=capacity
            )
            db.add(crowd_data)

print(f"✅ Added {len(stations) * 7 * 24} crowd records")

# 2. GENERATE TRAFFIC PATTERNS
print("\n📈 Generating TrafficPattern...")
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

for station in stations:
    for day in days:
        for hour in range(24):
            is_peak = hour in [7, 8, 9, 17, 18, 19]
            
            if is_peak:
                avg_passengers = random.randint(800, 1200)
                peak_status = "peak"
            else:
                avg_passengers = random.randint(100, 400)
                peak_status = "off-peak"
            
            pattern = TrafficPattern(
                station_id=station.station_id,
                day_of_week=day,
                hour=hour,
                avg_passengers=avg_passengers,
                peak_status=peak_status
            )
            db.add(pattern)

print(f"✅ Added {len(stations) * 7 * 24} traffic pattern records")

# 3. GENERATE PASSENGER DEMAND FORECAST (next 7 days)
print("\n🤖 Generating PassengerDemandForecast...")
forecast_date = datetime.now().date()

for station in stations:
    for route in routes:
        for day in range(7):
            current_date = forecast_date + timedelta(days=day)
            
            for hour in range(24):
                is_peak = hour in [7, 8, 9, 17, 18, 19]
                
                if is_peak:
                    predicted = random.randint(800, 1200)
                    confidence = round(random.uniform(0.85, 0.99), 2)
                else:
                    predicted = random.randint(100, 400)
                    confidence = round(random.uniform(0.75, 0.95), 2)
                
                forecast = PassengerDemandForecast(
                    station_id=station.station_id,
                    route_id=route.route_id,
                    forecast_date=current_date,
                    forecast_hour=hour,
                    predicted_passengers=predicted,
                    confidence_score=confidence
                )
                db.add(forecast)

print(f"✅ Added {len(stations) * len(routes) * 7 * 24} forecast records")

# 4. GENERATE TRAIN OCCUPANCY (current status)
print("\n🚂 Generating TrainOccupancy...")
for trip in trips:
    for station in stations[:50]:  # Sample of stations
        occupancy = random.randint(40, 95)
        current = int((occupancy / 100) * 1000)
        
        occupancy_record = TrainOccupancy(
            trip_id=trip.trip_id,
            station_id=station.station_id,
            occupancy_percentage=occupancy,
            current_passengers=current,
            capacity=1000,
            timestamp=datetime.now()
        )
        db.add(occupancy_record)

print(f"✅ Added {len(trips) * 50} occupancy records")

# 5. GENERATE ALERTS
print("\n🚨 Generating AlertNotification...")
alert_types = ["overcrowding", "delay", "maintenance"]
severities = ["low", "medium", "high"]

for i, station in enumerate(stations[:100]):  # Sample alerts for 100 stations
    num_alerts = random.randint(0, 3)
    
    for _ in range(num_alerts):
        alert = AlertNotification(
            station_id=station.station_id,
            alert_type=random.choice(alert_types),
            message=f"Alert at {station.name}",
            severity=random.choice(severities),
            is_active=random.choice([True, False]),
            created_at=datetime.now() - timedelta(hours=random.randint(0, 48))
        )
        db.add(alert)

print(f"✅ Added alerts for sample stations")

# COMMIT ALL DATA
db.commit()
print("\n✨ All sample data generated and saved to PostgreSQL!")
db.close()