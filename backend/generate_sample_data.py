"""
MetroFlow - Generate Realistic Sample Data with Natural Fluctuations
This script creates 1.6+ million realistic records for Metro Crowd Management
"""

from datetime import datetime, timedelta
import random
from backend.database import SessionLocal
from backend.models import (
    Station, Route, Trip, StopTime,
    StationCrowdData, TrafficPattern, 
    PassengerDemandForecast, TrainOccupancy, 
    AlertNotification, Base
)
from backend.database import engine

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

print("=" * 80)
print("🚇 MetroFlow - Realistic Data Generation with Natural Fluctuations")
print("=" * 80)
print()

db = SessionLocal()

# ============================================================================
# PART 1: FUNCTION TO GENERATE REALISTIC PASSENGER DATA
# ============================================================================

def get_realistic_passenger_count(hour, day_of_week, station_id):
    """
    Generate realistic passenger count with NATURAL FLUCTUATIONS
    
    Why this function?
    - Real data doesn't have flat blocks
    - Each hour varies slightly (realistic)
    - Weekends are different from weekdays
    - Different stations have different patterns
    
    How it works:
    - Base number (what we expect)
    - Daily variation (changes day to day)
    - Hourly variation (changes hour to hour)
    - Weekend factor (lower on weekends)
    
    Returns: (crowd_level, passenger_count, capacity_percentage)
    """
    
    # Define time periods
    peak_hours = [7, 8, 9, 17, 18, 19]        # Morning 7-9am, Evening 5-7pm
    shoulder_hours = [6, 10, 16, 20]          # Entering/leaving peak
    morning_hours = [6, 7, 8, 9, 10]          # Morning commute
    evening_hours = [16, 17, 18, 19, 20]      # Evening commute
    night_hours = [22, 23, 0, 1, 2, 3, 4]     # Late night/early morning
    
    # ========================================================================
    # PEAK HOURS (7-9am, 5-7pm) - Busiest times
    # ========================================================================
    if hour in peak_hours:
        # Base: around 1000 passengers
        base = 950 + random.randint(-50, 100)  # 900-1050 range
        
        # Day-to-day variation (some days busier than others)
        daily_var = random.randint(-150, 250)   # ±150-250 variation
        
        # Within hour variation (random fluctuation)
        hourly_var = random.randint(-100, 100)  # ±100 variation
        
        # Weekend factor (weekends are quieter)
        # day_of_week: 0=Monday, 5=Saturday, 6=Sunday
        weekend_factor = 0.80 if day_of_week >= 5 else 1.0
        
        # Station variation (some stations busier than others)
        station_factor = 0.9 + random.random() * 0.2  # 0.9 to 1.1
        
        # Calculate total
        passenger_count = int((base + daily_var + hourly_var) * weekend_factor * station_factor)
        crowd_level = random.choice([4, 5])      # Crowded or very crowded
        capacity = 80 + random.randint(5, 20)    # 80-100% capacity
        
    # ========================================================================
    # SHOULDER HOURS (6am, 10am, 4pm, 8pm) - Transitioning
    # ========================================================================
    elif hour in shoulder_hours:
        # Base: around 400-500 passengers (between peak and off-peak)
        base = 400 + random.randint(-100, 150)
        
        # Day-to-day variation
        daily_var = random.randint(-80, 120)
        
        # Calculate
        passenger_count = base + daily_var
        crowd_level = random.choice([2, 3, 4])  # Moderate to crowded
        capacity = 50 + random.randint(5, 25)   # 50-75% capacity
        
    # ========================================================================
    # OFF-PEAK HOURS (everything else) - Quiet times
    # ========================================================================
    else:
        # Base: around 150-200 passengers
        base = 150 + random.randint(-50, 100)   # 100-250 base
        
        # Day-to-day variation
        daily_var = random.randint(-60, 100)
        
        # Within hour variation
        hourly_var = random.randint(-40, 60)
        
        # For night hours, even quieter
        if hour in night_hours:
            passenger_count = int((base + daily_var + hourly_var) * 0.5)  # 50% reduction
        else:
            passenger_count = int(base + daily_var + hourly_var)
        
        crowd_level = random.choice([1, 2, 3])  # Empty to moderate
        capacity = 25 + random.randint(5, 25)   # 25-50% capacity
    
    # Ensure passenger count stays in valid range (50-1500)
    passenger_count = max(50, min(1500, passenger_count))
    
    # Calculate capacity percentage
    station_capacity = 1400  # Assume each station has 1400 capacity
    capacity_percentage = min(100, (passenger_count / station_capacity) * 100)
    
    return crowd_level, passenger_count, capacity_percentage


# ============================================================================
# PART 2: GET DATA FROM DATABASE
# ============================================================================

print("📥 Step 1: Reading existing stations and routes...")
stations = db.query(Station).all()
routes = db.query(Route).all()

print(f"   ✅ Found {len(stations)} stations")
print(f"   ✅ Found {len(routes)} routes")
print()

# ============================================================================
# PART 3: GENERATE STATION CROWD DATA (44,016 records)
# ============================================================================

print("📊 Step 2: Generating StationCrowdData (44,016 records)...")
print("   (262 stations × 7 days × 24 hours)")
print()

# Delete existing crowd data
db.query(StationCrowdData).delete()

base_date = datetime(2026, 7, 1)  # Start date: July 1, 2026
crowd_count = 0

for station in stations:
    for day in range(7):  # 7 days of data
        current_date = base_date + timedelta(days=day)
        day_of_week = current_date.weekday()  # 0=Monday, 6=Sunday
        
        for hour in range(24):  # 24 hours per day
            # Get realistic passenger count with fluctuations
            crowd_level, passenger_count, capacity_pct = get_realistic_passenger_count(
                hour, day_of_week, station.station_id
            )
            
            # Create record
            crowd_data = StationCrowdData(
                station_id=station.station_id,
                timestamp=current_date.replace(hour=hour, minute=0, second=0),
                crowd_level=crowd_level,
                passenger_count=passenger_count,
                capacity_percentage=capacity_pct
            )
            
            db.add(crowd_data)
            crowd_count += 1

db.commit()
print(f"   ✅ Added {crowd_count} crowd records")
print()

# ============================================================================
# PART 4: GENERATE TRAFFIC PATTERNS (44,016 records)
# ============================================================================

print("📈 Step 3: Generating TrafficPattern (44,016 records)...")
print("   (Historical patterns by station, day, hour)")
print()

db.query(TrafficPattern).delete()

peak_hours_set = [7, 8, 9, 17, 18, 19]
traffic_count = 0

for station in stations:
    for day in range(7):
        current_date = base_date + timedelta(days=day)
        day_name = current_date.strftime("%A")
        day_of_week = current_date.weekday()
        
        for hour in range(24):
            # Determine if peak or off-peak
            if hour in peak_hours_set:
                avg_passengers = 950 + random.randint(-200, 300)  # Peak with variation
                peak_status = "peak"
            else:
                avg_passengers = 200 + random.randint(-100, 150)  # Off-peak with variation
                peak_status = "off-peak"
            
            # Ensure valid range
            avg_passengers = max(50, min(1500, avg_passengers))
            
            # Create record
            pattern = TrafficPattern(
                station_id=station.station_id,
                day_of_week=day_of_week,
                hour=hour,
                avg_passengers=avg_passengers,
                peak_status=peak_status
            )
            
            db.add(pattern)
            traffic_count += 1

db.commit()
print(f"   ✅ Added {traffic_count} traffic pattern records")
print()

# ============================================================================
# PART 5: GENERATE DEMAND FORECASTS (1,584,576 records) - For ML Training
# ============================================================================

print("🤖 Step 4: Generating PassengerDemandForecast (1,584,576 records)...")
print("   (262 stations × 36 routes × 7 days × 24 hours)")
print("   This is the LARGEST dataset for AI model training!")
print()

db.query(PassengerDemandForecast).delete()

forecast_count = 0

for station in stations:
    for route in routes:
        for day in range(7):
            forecast_date = base_date + timedelta(days=day)
            day_of_week = forecast_date.weekday()
            
            for hour in range(24):
                # Get realistic forecast using our function
                _, predicted_passengers, _ = get_realistic_passenger_count(
                    hour, day_of_week, station.station_id
                )
                
                # Confidence score: higher during peak hours (91%), lower off-peak (85%)
                if hour in peak_hours_set:
                    confidence = 0.91 + random.uniform(-0.05, 0.05)  # 86-96% for peaks
                else:
                    confidence = 0.85 + random.uniform(-0.05, 0.05)  # 80-90% for off-peak
                
                confidence = max(0.75, min(0.99, confidence))  # Keep in 0.75-0.99 range
                
                # Create record
                forecast = PassengerDemandForecast(
                    station_id=station.station_id,
                    route_id=route.route_id,
                    forecast_date=forecast_date,
                    forecast_hour=hour,
                    predicted_passengers=predicted_passengers,
                    confidence_score=confidence
                )
                
                db.add(forecast)
                forecast_count += 1
                
                # Print progress every 100k records
                if forecast_count % 100000 == 0:
                    print(f"   ⏳ Generated {forecast_count:,} forecasts...")

db.commit()
print(f"   ✅ Added {forecast_count:,} forecast records")
print()

# ============================================================================
# PART 6: GENERATE TRAIN OCCUPANCY (5,000 records)
# ============================================================================

print("🚆 Step 5: Generating TrainOccupancy (5,000 records)...")

db.query(TrainOccupancy).delete()

occupancy_count = 0

# Generate 5000 random occupancy snapshots
for i in range(5000):
    random_station = random.choice(stations)
    random_hour = random.randint(0, 23)
    
    # Get realistic occupancy
    _, passenger_count, capacity_pct = get_realistic_passenger_count(
        random_hour, random.randint(0, 6), random_station.station_id
    )
    
    occupancy = TrainOccupancy(
        trip_id=random.randint(1, 100),
        station_id=random_station.station_id,
        occupancy_percentage=capacity_pct,
        current_passengers=passenger_count,
        capacity=1400,
        timestamp=base_date + timedelta(hours=random.randint(0, 168))
    )
    
    db.add(occupancy)
    occupancy_count += 1

db.commit()
print(f"   ✅ Added {occupancy_count} occupancy records")
print()

# ============================================================================
# PART 7: GENERATE ALERT NOTIFICATIONS (164 records)
# ============================================================================

print("🚨 Step 6: Generating AlertNotification (164 records)...")

db.query(AlertNotification).delete()

alert_count = 0

# Generate 164 alerts for overcrowding situations
for i in range(164):
    random_station = random.choice(stations)
    
    alert = AlertNotification(
        station_id=random_station.station_id,
        alert_type="overcrowding",
        message=f"Station {random_station.station_id} exceeds 90% capacity",
        severity="high",
        is_active=False,
        created_at=base_date + timedelta(hours=random.randint(0, 168)),
        resolved_at=base_date + timedelta(hours=random.randint(0, 168))
    )
    
    db.add(alert)
    alert_count += 1

db.commit()
print(f"   ✅ Added {alert_count} alert records")
print()

# ============================================================================
# SUMMARY
# ============================================================================

print("=" * 80)
print("✨ DATA GENERATION COMPLETE!")
print("=" * 80)
print()

total_records = crowd_count + traffic_count + forecast_count + occupancy_count + alert_count

print(f"📊 RECORDS GENERATED:")
print(f"   ✅ StationCrowdData: {crowd_count:,} records")
print(f"   ✅ TrafficPattern: {traffic_count:,} records")
print(f"   ✅ PassengerDemandForecast: {forecast_count:,} records")
print(f"   ✅ TrainOccupancy: {occupancy_count:,} records")
print(f"   ✅ AlertNotification: {alert_count:,} records")
print(f"   ─────────────────────────────────")
print(f"   ✅ TOTAL: {total_records:,} records")
print()

print(f"🎯 KEY FEATURES:")
print(f"   ✅ Realistic fluctuations (not flat blocks!)")
print(f"   ✅ Peak/off-peak variations")
print(f"   ✅ Weekend patterns")
print(f"   ✅ Station-specific variations")
print(f"   ✅ 91% AI confidence for peaks")
print()

print(f"🚀 NEXT STEPS:")
print(f"   1. Run: python -m backend.export_datasets")
print(f"   2. Run: python run_eda.py")
print(f"   3. Check eda_output/ for charts with WAVY patterns!")
print()

db.close()