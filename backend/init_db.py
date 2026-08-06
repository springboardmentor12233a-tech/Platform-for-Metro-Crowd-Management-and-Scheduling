import os
import sqlite3
import pandas as pd
from werkzeug.security import generate_password_hash
from database import get_db, DB_PATH
from ml.train import generate_synthetic_data, train_and_save_model

def init_database():
    print(f"[DB Init] Initializing SQLite database at {DB_PATH}")
    
    # Remove existing DB file for a clean seed
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print("[DB Init] Removed existing database file.")
        except Exception as e:
            print(f"[DB Init] Note on file removal: {e}")

    conn = get_db()
    cur = conn.cursor()

    # 1. Users Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'operator')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 2. Stations Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        line TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        current_inflow INTEGER DEFAULT 0,
        current_outflow INTEGER DEFAULT 0,
        current_density REAL DEFAULT 0.0,
        status TEXT DEFAULT 'Low' CHECK(status IN ('Low', 'Moderate', 'High', 'Critical'))
    )
    ''')

    # 3. Footfall Records Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS footfall_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        hour INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL,
        passenger_count INTEGER NOT NULL,
        density_percentage REAL NOT NULL,
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
    )
    ''')

    # 4. Train Schedules Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS train_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_code TEXT UNIQUE NOT NULL,
        line TEXT NOT NULL,
        origin_station TEXT NOT NULL,
        destination_station TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        frequency_mins INTEGER NOT NULL,
        status TEXT DEFAULT 'On Time' CHECK(status IN ('On Time', 'Delayed', 'Cancelled', 'Recommended Frequency Update'))
    )
    ''')

    # 5. Alerts Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id INTEGER,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL CHECK(severity IN ('Info', 'Low', 'Medium', 'High', 'Critical')),
        message TEXT NOT NULL,
        status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Acknowledged', 'Resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
    )
    ''')

    # Seed Default Users
    users_data = [
        ('admin', generate_password_hash('admin123'), 'System Administrator', 'admin'),
        ('operator', generate_password_hash('operator123'), 'Metro Dispatch Operator', 'operator')
    ]
    cur.executemany('''
    INSERT INTO users (username, password_hash, full_name, role)
    VALUES (?, ?, ?, ?)
    ''', users_data)

    # Seed Stations
    stations_data = [
        ('ST-001', 'Central Terminal', 'Red Line', 1500, 1180, 420, 78.6, 'High'),
        ('ST-002', 'Tech Park Hub', 'Red Line', 1200, 1020, 310, 85.0, 'Critical'),
        ('ST-003', 'University Heights', 'Red Line', 900, 320, 140, 35.5, 'Low'),
        ('ST-004', 'City Center', 'Blue Line', 1100, 680, 290, 61.8, 'Moderate'),
        ('ST-005', 'Financial District', 'Blue Line', 800, 620, 210, 77.5, 'High'),
        ('ST-006', 'Harbor View', 'Blue Line', 1000, 240, 110, 24.0, 'Low'),
        ('ST-007', 'West End', 'Green Line', 850, 410, 180, 48.2, 'Moderate'),
        ('ST-008', 'Metro Plaza', 'Green Line', 950, 520, 230, 54.7, 'Moderate'),
        ('ST-009', 'North Junction', 'Yellow Line', 750, 190, 80, 25.3, 'Low'),
        ('ST-010', 'Airport Hub', 'Yellow Line', 1300, 940, 380, 72.3, 'High')
    ]
    cur.executemany('''
    INSERT INTO stations (station_code, name, line, capacity, current_inflow, current_outflow, current_density, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', stations_data)

    # Seed Schedules
    schedules_data = [
        ('TR-101', 'Red Line', 'Central Terminal', 'University Heights', '08:00', '08:35', 5, 'On Time'),
        ('TR-102', 'Red Line', 'University Heights', 'Central Terminal', '08:15', '08:50', 5, 'On Time'),
        ('TR-201', 'Blue Line', 'City Center', 'Harbor View', '08:10', '08:42', 8, 'Delayed'),
        ('TR-202', 'Blue Line', 'Harbor View', 'City Center', '08:25', '08:57', 8, 'On Time'),
        ('TR-301', 'Green Line', 'West End', 'Metro Plaza', '08:05', '08:30', 10, 'On Time'),
        ('TR-401', 'Yellow Line', 'North Junction', 'Airport Hub', '08:20', '08:55', 12, 'On Time')
    ]
    cur.executemany('''
    INSERT INTO train_schedules (train_code, line, origin_station, destination_station, departure_time, arrival_time, frequency_mins, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', schedules_data)

    # Seed Alerts
    alerts_data = [
        (2, 'Overcrowding', 'Critical', 'Tech Park Hub passenger density has reached 85.0% (1,020 passengers). Recommend immediate dispatch of 2 extra trains.', 'Active'),
        (1, 'Overcrowding Warning', 'High', 'Central Terminal passenger inflow spiking rapidly during morning peak hours (78.6% capacity).', 'Active'),
        (4, 'Schedule Delay', 'Medium', 'Train TR-201 on Blue Line delayed by 7 minutes due to signal calibration.', 'Active')
    ]
    cur.executemany('''
    INSERT INTO alerts (station_id, alert_type, severity, message, status)
    VALUES (?, ?, ?, ?, ?)
    ''', alerts_data)

    conn.commit()

    # Generate synthetic footfall dataset and train ML model
    print("[DB Init] Generating synthetic dataset and training ML model...")
    df = generate_synthetic_data(num_days=30)
    train_and_save_model(df)

    # Populate footfall_records from synthetic CSV (last 500 rows for rich recent history)
    recent_df = df.tail(500)
    for _, row in recent_df.iterrows():
        cur.execute('''
        INSERT INTO footfall_records (station_id, hour, day_of_week, passenger_count, density_percentage)
        VALUES (?, ?, ?, ?, ?)
        ''', (int(row['station_id']), int(row['hour']), int(row['day_of_week']), int(row['passenger_count']), float(row['density_percentage'])))

    conn.commit()
    conn.close()
    print("[DB Init] Database schema initialization and seeding complete successfully!")

if __name__ == '__main__':
    init_database()
