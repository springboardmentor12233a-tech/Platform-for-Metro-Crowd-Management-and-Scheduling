from .database import SessionLocal
from .models import StationCrowdData, TrafficPattern, PassengerDemandForecast, TrainOccupancy, AlertNotification
import csv
import os
from datetime import datetime

db = SessionLocal()

# Create data folder
os.makedirs("data", exist_ok=True)

print("📥 Exporting datasets to CSV...\n")

# 1. EXPORT STATION CROWD DATA
print("1️⃣  Exporting StationCrowdData...")
crowd_data = db.query(StationCrowdData).all()
with open("data/StationCrowdData.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "station_id", "timestamp", "crowd_level", "passenger_count", "capacity_percentage"])
    for row in crowd_data:
        writer.writerow([row.id, row.station_id, row.timestamp, row.crowd_level, row.passenger_count, row.capacity_percentage])
print(f"✅ Exported {len(crowd_data)} crowd records")

# 2. EXPORT TRAFFIC PATTERNS
print("\n2️⃣  Exporting TrafficPattern...")
traffic_data = db.query(TrafficPattern).all()
with open("data/TrafficPattern.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "station_id", "day_of_week", "hour", "avg_passengers", "peak_status"])
    for row in traffic_data:
        writer.writerow([row.id, row.station_id, row.day_of_week, row.hour, row.avg_passengers, row.peak_status])
print(f"✅ Exported {len(traffic_data)} traffic pattern records")

# 3. EXPORT PASSENGER DEMAND FORECAST
print("\n3️⃣  Exporting PassengerDemandForecast...")
forecast_data = db.query(PassengerDemandForecast).all()
with open("data/PassengerDemandForecast.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "station_id", "route_id", "forecast_date", "forecast_hour", "predicted_passengers", "confidence_score"])
    for row in forecast_data:
        writer.writerow([row.id, row.station_id, row.route_id, row.forecast_date, row.forecast_hour, row.predicted_passengers, row.confidence_score])
print(f"✅ Exported {len(forecast_data)} forecast records")

# 4. EXPORT TRAIN OCCUPANCY
print("\n4️⃣  Exporting TrainOccupancy...")
occupancy_data = db.query(TrainOccupancy).all()
with open("data/TrainOccupancy.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "trip_id", "station_id", "occupancy_percentage", "current_passengers", "capacity", "timestamp"])
    for row in occupancy_data:
        writer.writerow([row.id, row.trip_id, row.station_id, row.occupancy_percentage, row.current_passengers, row.capacity, row.timestamp])
print(f"✅ Exported {len(occupancy_data)} occupancy records")

# 5. EXPORT ALERTS
print("\n5️⃣  Exporting AlertNotification...")
alert_data = db.query(AlertNotification).all()
with open("data/AlertNotification.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "station_id", "alert_type", "message", "severity", "is_active", "created_at", "resolved_at"])
    for row in alert_data:
        writer.writerow([row.id, row.station_id, row.alert_type, row.message, row.severity, row.is_active, row.created_at, row.resolved_at])
print(f"✅ Exported {len(alert_data)} alert records")

print("\n✨ All datasets exported to 'data/' folder!")
print("\nFiles created:")
print("  📄 StationCrowdData.csv")
print("  📄 TrafficPattern.csv")
print("  📄 PassengerDemandForecast.csv")
print("  📄 TrainOccupancy.csv")
print("  📄 AlertNotification.csv")

db.close()