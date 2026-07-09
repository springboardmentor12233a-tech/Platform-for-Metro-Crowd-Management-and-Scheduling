"""
MetroFlow: Synthetic Dataset Generator
========================================
Generates 10 realistic synthetic datasets for the MetroFlow AI Platform.
All datasets share consistent station names, line names, train IDs, and date ranges
so they can be linked together for analysis.

Datasets Generated:
1. delhi_metro_ticketing.csv
2. passenger_entry_exit.csv
3. hourly_footfall.csv
4. station_footfall_daily.csv
5. metro_ridership.csv
6. train_occupancy.csv
7. train_schedule.csv
8. delay_logs.csv
9. rail_transport_stats.csv
10. metro_sensor_data.csv
"""

import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

# =============================================================================
# GLOBAL CONFIGURATION - Shared across all datasets
# =============================================================================
np.random.seed(42)

OUTPUT_DIR = "data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Date range: Jan 1, 2026 to Feb 28, 2026 (matching existing dataset)
DATE_START = datetime(2026, 1, 1)
DATE_END = datetime(2026, 2, 28)
ALL_DATES = [d.to_pydatetime() for d in pd.date_range(DATE_START, DATE_END, freq="D")]

# Delhi Metro Lines
LINES = {
    "Blue Line": {"color": "Blue", "stations": [
        "Dwarka Sector 21", "Dwarka Sector 8", "Dwarka", "Uttam Nagar East",
        "Janakpuri West", "Rajouri Garden", "Kirti Nagar", "Moti Nagar",
        "Ramesh Nagar", "Rajendra Place", "Karol Bagh", "Rajiv Chowk",
        "Barakhamba Road", "Mandi House", "Pragati Maidan", "Indraprastha",
        "Yamuna Bank", "Noida Sector 15", "Noida Sector 16", "Noida City Centre"
    ]},
    "Yellow Line": {"color": "Yellow", "stations": [
        "Samaypur Badli", "Rohini Sector 18", "Haiderpur Badli Mor",
        "Jahangirpuri", "Adarsh Nagar", "Azadpur", "Model Town",
        "GTB Nagar", "Vishwavidyalaya", "Vidhan Sabha", "Civil Lines",
        "Kashmere Gate", "Chandni Chowk", "Chawri Bazar", "New Delhi",
        "Rajiv Chowk", "Patel Chowk", "Central Secretariat", "Udyog Bhawan",
        "Race Course", "Jor Bagh", "INA", "AIIMS", "Green Park",
        "Hauz Khas", "Malviya Nagar", "Saket", "Qutab Minar",
        "Chhattarpur", "Sultanpur", "Ghitorni", "Arjan Garh",
        "Guru Dronacharya", "Sikanderpur", "MG Road", "IFFCO Chowk",
        "HUDA City Centre"
    ]},
    "Red Line": {"color": "Red", "stations": [
        "Rithala", "Rohini West", "Rohini East", "Pitampura",
        "Kohat Enclave", "Netaji Subhash Place", "Keshav Puram",
        "Kanhaiya Nagar", "Inderlok", "Shastri Nagar", "Pratap Nagar",
        "Pulbangash", "Tis Hazari", "Kashmere Gate", "Shastri Park",
        "Seelampur", "Welcome", "Shahdara", "Dilshad Garden"
    ]},
    "Green Line": {"color": "Green", "stations": [
        "Kirti Nagar", "Satguru Ram Singh Marg", "Ashok Park Main",
        "Punjabi Bagh", "Shivaji Park", "Madipur", "Paschim Vihar East",
        "Paschim Vihar West", "Peeragarhi", "Udyog Nagar",
        "Maharaja Surajmal Stadium", "Nangloi", "Nangloi Railway Station",
        "Rajdhani Park", "Mundka", "Brigadier Hoshiar Singh"
    ]},
    "Violet Line": {"color": "Violet", "stations": [
        "Kashmere Gate", "Lal Quila", "Jama Masjid", "Delhi Gate",
        "ITO", "Mandi House", "Janpath", "Central Secretariat",
        "Khan Market", "JLN Stadium", "Jangpura", "Lajpat Nagar",
        "Moolchand", "Kailash Colony", "Nehru Place", "Kalkaji Mandir",
        "Govindpuri", "Harkesh Nagar Okhla", "Jasola Apollo",
        "Sarita Vihar", "Mohan Estate", "Tughlakabad", "Badarpur Border",
        "Sarai", "NHPC Chowk", "Mewala Maharajpur", "Sector 28",
        "Badkhal Mor", "Old Faridabad", "Neelam Chowk Ajronda",
        "Bata Chowk", "Escorts Mujesar", "Raja Nahar Singh"
    ]}
}

# Top 20 busiest stations (used for higher traffic in data generation)
TOP_STATIONS = [
    "Rajiv Chowk", "Kashmere Gate", "Hauz Khas", "New Delhi",
    "Chandni Chowk", "Central Secretariat", "Noida City Centre",
    "HUDA City Centre", "Vishwavidyalaya", "Karol Bagh",
    "Mandi House", "Lajpat Nagar", "Dwarka Sector 21", "Nehru Place",
    "Rajouri Garden", "Yamuna Bank", "Azadpur", "Sikanderpur",
    "Janakpuri West", "Dilshad Garden"
]

# All unique stations
ALL_STATIONS = list(set(
    station for line_data in LINES.values()
    for station in line_data["stations"]
))
ALL_STATIONS.sort()

LINE_NAMES = list(LINES.keys())

# Train IDs
TRAIN_IDS = [f"DMT-{line[:1]}{i:03d}" for line in LINE_NAMES for i in range(1, 26)]

# Weather options with probabilities (Jan-Feb Delhi)
WEATHER_OPTIONS = ["Clear", "Foggy", "Cloudy", "Rainy", "Smoggy"]
WEATHER_PROBS = [0.30, 0.30, 0.20, 0.10, 0.10]

# Time helpers
HOURS = list(range(5, 24))  # Metro runs 5 AM to 11 PM
PEAK_HOURS = [8, 9, 10, 17, 18, 19]
OFF_PEAK_HOURS = [h for h in HOURS if h not in PEAK_HOURS]

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

PAYMENT_MODES = ["Smart Card", "Token", "QR Code", "National Common Mobility Card", "Tourist Card"]
PAYMENT_PROBS = [0.45, 0.25, 0.15, 0.10, 0.05]

PASSENGER_TYPES = ["Regular", "Student", "Senior Citizen", "Differently Abled", "Female"]
PASSENGER_TYPE_PROBS = [0.50, 0.20, 0.10, 0.05, 0.15]


def get_station_line(station):
    """Return the line name for a given station."""
    for line_name, line_data in LINES.items():
        if station in line_data["stations"]:
            return line_name
    return np.random.choice(LINE_NAMES)


def is_peak_hour(hour):
    """Check if an hour is peak hour."""
    return hour in PEAK_HOURS


def traffic_multiplier(hour, is_holiday=False):
    """Return a traffic multiplier based on time and holiday status."""
    if is_holiday:
        return 0.5
    if hour in PEAK_HOURS:
        return np.random.uniform(2.0, 3.5)
    elif hour in [7, 11, 12, 13, 16, 20]:
        return np.random.uniform(1.2, 1.8)
    else:
        return np.random.uniform(0.3, 0.8)


def station_popularity(station):
    """Return a popularity factor for a station."""
    if station in TOP_STATIONS[:5]:
        return np.random.uniform(2.5, 4.0)
    elif station in TOP_STATIONS:
        return np.random.uniform(1.5, 2.5)
    else:
        return np.random.uniform(0.5, 1.2)


# =============================================================================
# DATASET 1: Delhi Metro Ticketing Data
# =============================================================================
def generate_ticketing_data(n=15000):
    print("Generating Dataset 1: Delhi Metro Ticketing Data...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name in ["Sunday"] or date.day in [26] else 0  # Republic Day

        hour = np.random.choice(HOURS, p=[
            0.02, 0.03, 0.05, 0.12, 0.13, 0.10,  # 5-10
            0.06, 0.05, 0.04, 0.04, 0.04, 0.05,  # 11-16
            0.10, 0.08, 0.05, 0.02, 0.01, 0.005, 0.005  # 17-23
        ])
        minute = np.random.choice([0, 15, 30, 45])
        time_str = f"{hour:02d}:{minute:02d}"

        from_station = np.random.choice(ALL_STATIONS)
        to_station = np.random.choice([s for s in ALL_STATIONS if s != from_station])

        # Fare based on distance (simplified)
        base_fare = np.random.choice([10, 15, 20, 25, 30, 40, 50, 60])
        payment_mode = np.random.choice(PAYMENT_MODES, p=PAYMENT_PROBS)
        if payment_mode == "Smart Card":
            fare = round(base_fare * 0.9, 2)  # 10% discount
        else:
            fare = base_fare

        card_type = np.random.choice(PASSENGER_TYPES, p=PASSENGER_TYPE_PROBS)

        records.append({
            "transaction_id": f"TXN-{i+1:06d}",
            "date": date.strftime("%Y-%m-%d"),
            "time": time_str,
            "day": day_name,
            "from_station": from_station,
            "to_station": to_station,
            "line": get_station_line(from_station),
            "fare": fare,
            "payment_mode": payment_mode,
            "card_type": card_type,
            "passenger_type": card_type,
            "is_holiday": is_holiday,
            "trip_duration_min": np.random.randint(5, 75)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "delhi_metro_ticketing.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 2: Passenger Entry & Exit Data
# =============================================================================
def generate_entry_exit_data(n=12000):
    print("Generating Dataset 2: Passenger Entry & Exit Data...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        hour = np.random.choice(HOURS)
        minute = np.random.choice(range(0, 60, 15))
        time_str = f"{hour:02d}:{minute:02d}"

        station = np.random.choice(ALL_STATIONS)
        pop = station_popularity(station)
        mult = traffic_multiplier(hour, is_holiday)

        base_entry = int(np.random.poisson(80) * pop * mult)
        base_exit = int(np.random.poisson(75) * pop * mult)

        entry_count = max(5, base_entry)
        exit_count = max(3, base_exit)

        gate_id = f"G-{np.random.randint(1, 8):02d}"

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "time": time_str,
            "day": day_name,
            "station": station,
            "line": get_station_line(station),
            "entry_count": entry_count,
            "exit_count": exit_count,
            "net_flow": entry_count - exit_count,
            "gate_id": gate_id,
            "is_peak_hour": 1 if is_peak_hour(hour) else 0,
            "is_holiday": is_holiday,
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "passenger_entry_exit.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 3: Hourly Footfall Data
# =============================================================================
def generate_hourly_footfall(n=10000):
    print("Generating Dataset 3: Hourly Footfall Data...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        hour = np.random.choice(HOURS)
        station = np.random.choice(ALL_STATIONS)
        line = get_station_line(station)
        pop = station_popularity(station)
        mult = traffic_multiplier(hour, is_holiday)

        footfall = max(10, int(np.random.poisson(200) * pop * mult))
        direction = np.random.choice(["Up", "Down"])

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "day": day_name,
            "hour": hour,
            "station": station,
            "line": line,
            "footfall_count": footfall,
            "direction": direction,
            "is_peak_hour": 1 if is_peak_hour(hour) else 0,
            "is_holiday": is_holiday,
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "hourly_footfall.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 4: Station Footfall Daily Summary
# =============================================================================
def generate_station_footfall_daily(n=5000):
    print("Generating Dataset 4: Station Footfall Daily Summary...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        station = np.random.choice(ALL_STATIONS)
        line = get_station_line(station)
        pop = station_popularity(station)

        if is_holiday:
            base = 800
        elif day_name in ["Saturday"]:
            base = 1500
        else:
            base = 3000

        daily_entries = max(100, int(np.random.poisson(base) * pop))
        daily_exits = max(80, int(np.random.poisson(base * 0.95) * pop))

        # Interchange stations have more traffic
        is_interchange = 1 if station in ["Rajiv Chowk", "Kashmere Gate",
                                           "Mandi House", "Kirti Nagar",
                                           "Central Secretariat"] else 0
        zone = np.random.choice([1, 2, 3, 4], p=[0.3, 0.3, 0.25, 0.15])

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "day": day_name,
            "station": station,
            "line": line,
            "zone": zone,
            "daily_entries": daily_entries,
            "daily_exits": daily_exits,
            "total_footfall": daily_entries + daily_exits,
            "is_interchange": is_interchange,
            "is_holiday": is_holiday,
            "avg_dwell_time_sec": np.random.randint(15, 45),
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "station_footfall_daily.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 5: Metro Ridership Data
# =============================================================================
def generate_ridership_data(n=8000):
    print("Generating Dataset 5: Metro Ridership Data...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        line = np.random.choice(LINE_NAMES)
        line_factor = {"Blue Line": 1.5, "Yellow Line": 1.8,
                       "Red Line": 1.0, "Green Line": 0.7,
                       "Violet Line": 1.2}[line]

        if is_holiday:
            base_ridership = 15000
        elif day_name == "Saturday":
            base_ridership = 25000
        else:
            base_ridership = 45000

        ridership = max(5000, int(np.random.poisson(base_ridership) * line_factor))
        avg_trip_duration = np.random.uniform(15, 55)
        revenue = ridership * np.random.uniform(18, 32)

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "day": day_name,
            "line": line,
            "ridership_count": ridership,
            "avg_trip_duration_min": round(avg_trip_duration, 1),
            "revenue_inr": round(revenue, 2),
            "transport_type": "Metro Rail",
            "total_trips": np.random.randint(150, 400),
            "operational_hours": np.random.uniform(17.5, 19.0),
            "is_holiday": is_holiday,
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "metro_ridership.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 6: Train Occupancy Data
# =============================================================================
def generate_train_occupancy(n=10000):
    print("Generating Dataset 6: Train Occupancy Data...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        hour = np.random.choice(HOURS)
        minute = np.random.choice(range(0, 60, 5))
        time_str = f"{hour:02d}:{minute:02d}"

        train_id = np.random.choice(TRAIN_IDS)
        line = np.random.choice(LINE_NAMES)
        station = np.random.choice(LINES[line]["stations"])
        coach_number = np.random.randint(1, 9)
        capacity = np.random.choice([300, 320, 340, 350])

        mult = traffic_multiplier(hour, is_holiday)
        base_occupancy = np.random.uniform(20, 50) * mult
        occupancy_percent = min(120, max(5, base_occupancy))  # Can be over 100% (overcrowded)
        passenger_count = int(capacity * occupancy_percent / 100)

        if occupancy_percent >= 100:
            crowd_level = "Overcrowded"
        elif occupancy_percent >= 80:
            crowd_level = "High"
        elif occupancy_percent >= 50:
            crowd_level = "Medium"
        else:
            crowd_level = "Low"

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "time": time_str,
            "day": day_name,
            "train_id": train_id,
            "line": line,
            "station": station,
            "coach_number": coach_number,
            "capacity": capacity,
            "passenger_count": passenger_count,
            "occupancy_percent": round(occupancy_percent, 1),
            "crowd_level": crowd_level,
            "is_peak_hour": 1 if is_peak_hour(hour) else 0,
            "is_holiday": is_holiday,
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "train_occupancy.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 7: Train Schedule Data
# =============================================================================
def generate_train_schedule(n=3000):
    print("Generating Dataset 7: Train Schedule Data...")
    records = []
    for i in range(n):
        line = np.random.choice(LINE_NAMES)
        stations = LINES[line]["stations"]
        idx1, idx2 = sorted(np.random.choice(len(stations), 2, replace=False))
        dep_station = stations[idx1]
        arr_station = stations[idx2]

        train_id = np.random.choice([t for t in TRAIN_IDS if t.startswith(f"DMT-{line[0]}")])

        hour = np.random.choice(HOURS)
        dep_min = np.random.choice(range(0, 60, 5))
        travel_time = (idx2 - idx1) * np.random.randint(2, 4)  # 2-4 min per station
        arr_hour = hour + (dep_min + travel_time) // 60
        arr_min = (dep_min + travel_time) % 60

        if arr_hour >= 24:
            arr_hour = 23
            arr_min = 55

        scheduled_departure = f"{hour:02d}:{dep_min:02d}"
        scheduled_arrival = f"{arr_hour:02d}:{arr_min:02d}"

        frequency = np.random.choice(["Every 3 min", "Every 5 min", "Every 7 min",
                                       "Every 10 min", "Every 15 min"],
                                      p=[0.15, 0.35, 0.25, 0.15, 0.10])

        status = np.random.choice(["On Time", "Delayed", "Cancelled", "Running"],
                                   p=[0.70, 0.15, 0.03, 0.12])

        platform = np.random.randint(1, 5)
        direction = np.random.choice(["Up", "Down"])

        records.append({
            "train_id": train_id,
            "line": line,
            "departure_station": dep_station,
            "arrival_station": arr_station,
            "scheduled_departure": scheduled_departure,
            "scheduled_arrival": scheduled_arrival,
            "travel_time_min": travel_time,
            "stops": idx2 - idx1,
            "frequency": frequency,
            "status": status,
            "platform": platform,
            "direction": direction,
            "coach_count": np.random.choice([4, 6, 8]),
            "ac_type": np.random.choice(["Full AC", "Non-AC"], p=[0.85, 0.15])
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "train_schedule.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 8: Delay Logs
# =============================================================================
def generate_delay_logs(n=6000):
    print("Generating Dataset 8: Delay Logs...")
    delay_reasons = [
        "Signal Failure", "Door Malfunction", "Passenger Emergency",
        "Track Maintenance", "Overcrowding", "Power Failure",
        "Weather Disruption", "Technical Fault", "Security Alert",
        "Staff Shortage", "Platform Crowding", "Switch Failure"
    ]
    delay_reason_probs = [0.15, 0.12, 0.10, 0.10, 0.12, 0.08,
                          0.08, 0.10, 0.03, 0.04, 0.05, 0.03]

    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        hour = np.random.choice(HOURS)
        minute = np.random.randint(0, 60)
        time_str = f"{hour:02d}:{minute:02d}"

        train_id = np.random.choice(TRAIN_IDS)
        line = np.random.choice(LINE_NAMES)
        station = np.random.choice(LINES[line]["stations"])

        reason = np.random.choice(delay_reasons, p=delay_reason_probs)

        # Delay minutes - most are small, some are large
        if reason in ["Signal Failure", "Power Failure", "Track Maintenance"]:
            delay_min = np.random.choice(range(5, 60), p=np.array(
                [max(0.001, 0.1 - i*0.001) for i in range(55)]
            ) / sum([max(0.001, 0.1 - i*0.001) for i in range(55)]))
        else:
            delay_min = np.random.choice(range(1, 30), p=np.array(
                [max(0.001, 0.15 - i*0.004) for i in range(29)]
            ) / sum([max(0.001, 0.15 - i*0.004) for i in range(29)]))

        weather = np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        if weather in ["Foggy", "Rainy"]:
            delay_min = int(delay_min * 1.3)

        if delay_min >= 20:
            impact = "High"
        elif delay_min >= 10:
            impact = "Medium"
        else:
            impact = "Low"

        affected_passengers = int(np.random.poisson(200) * (delay_min / 5))

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "time": time_str,
            "day": day_name,
            "train_id": train_id,
            "line": line,
            "station": station,
            "delay_minutes": delay_min,
            "delay_reason": reason,
            "weather": weather,
            "impact_level": impact,
            "affected_passengers": max(10, affected_passengers),
            "is_peak_hour": 1 if is_peak_hour(hour) else 0,
            "is_holiday": is_holiday,
            "resolution_time_min": delay_min + np.random.randint(2, 15)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "delay_logs.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 9: Rail Transport Stats
# =============================================================================
def generate_rail_transport_stats(n=4000):
    print("Generating Dataset 9: Rail Transport Stats...")
    records = []
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        day_name = DAYS_OF_WEEK[date.weekday()]
        is_holiday = 1 if day_name == "Sunday" or date.day == 26 else 0

        line = np.random.choice(LINE_NAMES)
        line_lengths = {"Blue Line": 56.6, "Yellow Line": 49.3,
                        "Red Line": 25.1, "Green Line": 29.6,
                        "Violet Line": 46.6}
        distance_km = line_lengths[line]

        total_trips = np.random.randint(120, 380) if not is_holiday else np.random.randint(60, 200)
        total_passengers = total_trips * np.random.randint(200, 450)
        avg_speed = np.random.uniform(30, 45)
        energy_kwh = total_trips * np.random.uniform(150, 280)
        on_time = np.random.uniform(75, 98)

        records.append({
            "date": date.strftime("%Y-%m-%d"),
            "day": day_name,
            "line": line,
            "total_trips": total_trips,
            "total_passengers": total_passengers,
            "avg_speed_kmph": round(avg_speed, 1),
            "distance_km": distance_km,
            "energy_consumption_kwh": round(energy_kwh, 2),
            "on_time_percent": round(on_time, 1),
            "revenue_inr": round(total_passengers * np.random.uniform(18, 28), 2),
            "operational_cost_inr": round(total_trips * np.random.uniform(5000, 12000), 2),
            "is_holiday": is_holiday,
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "rail_transport_stats.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# DATASET 10: Metro Sensor Data
# =============================================================================
def generate_sensor_data(n=8000):
    print("Generating Dataset 10: Metro Sensor Data...")
    sensor_types = {
        "Temperature": {"unit": "°C", "range": (15, 42), "alert_high": 38},
        "Humidity": {"unit": "%", "range": (30, 90), "alert_high": 80},
        "CO2_Level": {"unit": "ppm", "range": (350, 2500), "alert_high": 1500},
        "Noise_Level": {"unit": "dB", "range": (40, 110), "alert_high": 95},
        "Vibration": {"unit": "mm/s", "range": (0.1, 15.0), "alert_high": 10.0},
        "Air_Quality_Index": {"unit": "AQI", "range": (20, 400), "alert_high": 300},
        "Platform_Weight": {"unit": "kg", "range": (500, 50000), "alert_high": 40000},
        "Door_Cycle_Count": {"unit": "cycles", "range": (0, 500), "alert_high": 400},
        "Power_Consumption": {"unit": "kW", "range": (50, 800), "alert_high": 700},
        "Brake_Pressure": {"unit": "bar", "range": (3.0, 9.0), "alert_high": 8.5}
    }

    records = []
    sensor_counter = 1
    for i in range(n):
        date = np.random.choice(ALL_DATES)
        hour = np.random.choice(HOURS)
        minute = np.random.randint(0, 60)
        second = np.random.randint(0, 60)
        timestamp = date.strftime("%Y-%m-%d") + f" {hour:02d}:{minute:02d}:{second:02d}"

        station = np.random.choice(ALL_STATIONS)
        sensor_type = np.random.choice(list(sensor_types.keys()))
        sensor_info = sensor_types[sensor_type]

        sensor_id = f"SEN-{station[:3].upper()}-{sensor_type[:3].upper()}-{sensor_counter:04d}"
        sensor_counter += 1

        value = round(np.random.uniform(*sensor_info["range"]), 2)
        alert_flag = 1 if value >= sensor_info["alert_high"] else 0
        status = "Alert" if alert_flag else np.random.choice(
            ["Normal", "Warning"], p=[0.92, 0.08]
        )

        records.append({
            "timestamp": timestamp,
            "sensor_id": sensor_id,
            "station": station,
            "line": get_station_line(station),
            "sensor_type": sensor_type,
            "value": value,
            "unit": sensor_info["unit"],
            "status": status,
            "alert_flag": alert_flag,
            "maintenance_required": 1 if status == "Alert" and np.random.random() > 0.5 else 0,
            "last_calibration_date": (date - timedelta(days=np.random.randint(1, 90))).strftime("%Y-%m-%d"),
            "weather": np.random.choice(WEATHER_OPTIONS, p=WEATHER_PROBS)
        })

    df = pd.DataFrame(records)
    path = os.path.join(OUTPUT_DIR, "metro_sensor_data.csv")
    df.to_csv(path, index=False)
    print(f"  -> Saved {len(df)} rows to {path}")
    return df


# =============================================================================
# MAIN EXECUTION
# =============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("MetroFlow: Synthetic Dataset Generator")
    print("=" * 60)
    print(f"Output Directory: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Date Range: {DATE_START.strftime('%Y-%m-%d')} to {DATE_END.strftime('%Y-%m-%d')}")
    print(f"Total Stations: {len(ALL_STATIONS)}")
    print(f"Total Lines: {len(LINE_NAMES)}")
    print(f"Total Train IDs: {len(TRAIN_IDS)}")
    print("=" * 60)
    print()

    datasets = {}
    datasets["ticketing"] = generate_ticketing_data(15000)
    datasets["entry_exit"] = generate_entry_exit_data(12000)
    datasets["hourly_footfall"] = generate_hourly_footfall(10000)
    datasets["station_footfall"] = generate_station_footfall_daily(5000)
    datasets["ridership"] = generate_ridership_data(8000)
    datasets["train_occupancy"] = generate_train_occupancy(10000)
    datasets["train_schedule"] = generate_train_schedule(3000)
    datasets["delay_logs"] = generate_delay_logs(6000)
    datasets["rail_stats"] = generate_rail_transport_stats(4000)
    datasets["sensor_data"] = generate_sensor_data(8000)

    print()
    print("=" * 60)
    print("GENERATION COMPLETE - Summary:")
    print("=" * 60)
    total_rows = 0
    for name, df in datasets.items():
        print(f"  {name:25s} -> {len(df):>6,} rows x {len(df.columns):>3} cols")
        total_rows += len(df)
    print(f"\n  TOTAL: {total_rows:,} rows across {len(datasets)} datasets")
    print("=" * 60)
