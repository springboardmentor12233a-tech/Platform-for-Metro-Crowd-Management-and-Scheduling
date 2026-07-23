import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

STATIONS = [
    {"name": "Central Hub", "code": "HUB", "capacity": 5000},
    {"name": "North Terminal", "code": "NTH", "capacity": 3000},
    {"name": "Airport Station", "code": "APT", "capacity": 4000},
    {"name": "Financial District", "code": "FID", "capacity": 4500},
    {"name": "Tech Park", "code": "TEC", "capacity": 3500},
    {"name": "University City", "code": "UNI", "capacity": 2500},
    {"name": "Old Town", "code": "OLD", "capacity": 2000},
    {"name": "South Terminal", "code": "STH", "capacity": 3000},
]

WEATHER_MAPPING = {"Clear": 0, "Rainy": 1, "Snowy": 2, "Stormy": 3}

def generate_historical_data(days=180):
    start_date = datetime.utcnow() - timedelta(days=days)
    end_date = datetime.utcnow()
    
    date_range = pd.date_range(start=start_date, end=end_date, freq='h')
    
    rows = []
    
    for station in STATIONS:
        capacity = station["capacity"]
        code = station["code"]
        name = station["name"]
        
        # Initialize lag passenger count
        last_passenger_count = int(capacity * 0.1)
        
        for dt in date_range:
            hour = dt.hour
            day_of_week = dt.weekday()
            month = dt.month
            
            is_weekend = day_of_week >= 5
            is_holiday = int(day_of_week == 6 or random.random() < 0.02) # Sunday or 2% random holiday
            is_special_event = int(random.random() < 0.04) # 4% chance
            
            # Weather probability
            weather_choice = np.random.choice(["Clear", "Rainy", "Snowy", "Stormy"], p=[0.75, 0.16, 0.07, 0.02])
            weather_code = WEATHER_MAPPING[weather_choice]
            
            # Base load curves
            is_peak = (8 <= hour <= 10) or (17 <= hour <= 19)
            
            if is_weekend:
                base_load = 0.2
                if 12 <= hour <= 16:
                    base_load = 0.4
            else:
                base_load = 0.15
                if is_peak:
                    base_load = 0.75
                elif 11 <= hour <= 16:
                    base_load = 0.4
            
            # Specific station logic
            if code == "APT":
                # Airport is consistently moderate with random flights arrivals
                base_load = 0.45 + np.random.uniform(-0.15, 0.15)
            elif code in ["FID", "TEC"] and is_peak:
                # Business hubs have extreme peaks
                base_load = 0.82 if hour in [8, 9, 17, 18] else 0.65
            elif code == "UNI":
                # University has mid-day peaks and drops on weekends
                if is_weekend:
                    base_load = 0.1
                else:
                    base_load = 0.55 if 10 <= hour <= 15 else 0.25
            
            # Adjust base load for weather (bad weather increases metro occupancy slightly due to road traffic)
            if weather_choice in ["Rainy", "Stormy"]:
                base_load *= 1.1
            
            # Special events spike crowd
            if is_special_event:
                base_load += 0.25
                
            # Keep base load within boundaries
            base_load = min(max(base_load, 0.02), 0.98)
            
            # Random noise
            noise = np.random.normal(0, 0.05)
            occupancy_rate = min(max(base_load + noise, 0.01), 0.99)
            
            passenger_count = int(capacity * occupancy_rate)
            
            # Derive inflow/outflow
            if is_peak and not is_weekend:
                inflow = int(passenger_count * np.random.uniform(0.12, 0.22))
                outflow = int(passenger_count * np.random.uniform(0.08, 0.15))
            else:
                inflow = int(passenger_count * np.random.uniform(0.05, 0.12))
                outflow = int(passenger_count * np.random.uniform(0.05, 0.12))
                
            inflow = max(inflow, 5)
            outflow = max(outflow, 5)
            
            rows.append({
                "station_name": name,
                "station_code": code,
                "capacity": capacity,
                "recorded_at": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "passenger_count": passenger_count,
                "inflow_rate": inflow,
                "outflow_rate": outflow,
                "hour_of_day": hour,
                "day_of_week": day_of_week,
                "month": month,
                "is_holiday": is_holiday,
                "is_special_event": is_special_event,
                "weather": weather_choice,
                "weather_code": weather_code,
                "lag_passenger_count": last_passenger_count
            })
            
            last_passenger_count = passenger_count
            
    df = pd.DataFrame(rows)
    return df

if __name__ == "__main__":
    print("Generating synthetic crowd history dataset...")
    df = generate_historical_data(days=180)
    
    # Ensure folder exists
    os.makedirs("ml_pipeline/data", exist_ok=True)
    
    csv_path = "ml_pipeline/data/metro_crowd_data.csv"
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated. Rows: {len(df)}. Saved to {csv_path}")
