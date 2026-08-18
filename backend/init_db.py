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
        status TEXT DEFAULT 'Low' CHECK(status IN ('Low', 'Moderate', 'High', 'Critical')),
        station_status TEXT DEFAULT 'Active',
        is_interchange INTEGER DEFAULT 0
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

    # Seed Bengaluru Namma Metro Stations (15 line-station entries)
    stations_data = [
        # Purple Line
        ('ST-001', 'Whitefield (Kadugodi)', 'Purple Line', 1200, 640, 280, 53.3, 'Moderate', 'Active', 0),
        ('ST-002', 'Krishnarajapura (K.R. Pura)', 'Purple Line', 1300, 1020, 390, 78.5, 'High', 'Active', 0),
        ('ST-003', 'Indiranagar', 'Purple Line', 1100, 890, 340, 80.9, 'Critical', 'Active', 0),
        ('ST-004', 'Nadaprabhu Kempegowda Station, Majestic', 'Purple Line', 1800, 1550, 680, 86.1, 'Critical', 'Active', 1),
        ('ST-005', 'Kengeri', 'Purple Line', 900, 310, 140, 34.4, 'Low', 'Active', 0),
        # Green Line
        ('ST-006', 'Madavara', 'Green Line', 850, 260, 110, 30.6, 'Low', 'Active', 0),
        ('ST-007', 'Yeshwanthpur', 'Green Line', 1300, 940, 410, 72.3, 'High', 'Active', 0),
        ('ST-008', 'Nadaprabhu Kempegowda Station, Majestic', 'Green Line', 1800, 1480, 620, 82.2, 'Critical', 'Active', 1),
        ('ST-009', 'Jayanagar', 'Green Line', 1000, 480, 210, 48.0, 'Moderate', 'Active', 0),
        ('ST-010', 'Silk Institute', 'Green Line', 800, 210, 90, 26.3, 'Low', 'Active', 0),
        # Yellow Line
        ('ST-011', 'RV Road', 'Yellow Line', 1100, 720, 310, 65.5, 'High', 'Active', 1),
        ('ST-012', 'Jayadeva Hospital', 'Yellow Line', 1250, 830, 360, 66.4, 'High', 'Active', 0),
        ('ST-013', 'Central Silk Board', 'Yellow Line', 1500, 1290, 510, 86.0, 'Critical', 'Active', 0),
        ('ST-014', 'Electronic City', 'Yellow Line', 1400, 1150, 480, 82.1, 'Critical', 'Active', 0),
        ('ST-015', 'Delta Electronics Bommasandra', 'Yellow Line', 950, 340, 150, 35.8, 'Low', 'Active', 0)
    ]
    cur.executemany('''
    INSERT INTO stations (station_code, name, line, capacity, current_inflow, current_outflow, current_density, status, station_status, is_interchange)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', stations_data)

    # Seed Schedules with exact Bengaluru Station Names
    schedules_data = [
        ('TR-P101', 'Purple Line', 'Whitefield (Kadugodi)', 'Kengeri', '08:00', '08:45', 5, 'On Time'),
        ('TR-P102', 'Purple Line', 'Kengeri', 'Whitefield (Kadugodi)', '08:15', '09:00', 5, 'Delayed'),
        ('TR-G201', 'Green Line', 'Madavara', 'Silk Institute', '08:05', '08:50', 6, 'On Time'),
        ('TR-G202', 'Green Line', 'Silk Institute', 'Madavara', '08:20', '09:05', 6, 'On Time'),
        ('TR-Y301', 'Yellow Line', 'RV Road', 'Delta Electronics Bommasandra', '08:10', '08:48', 8, 'On Time'),
        ('TR-Y302', 'Yellow Line', 'Delta Electronics Bommasandra', 'RV Road', '08:25', '09:03', 8, 'On Time')
    ]
    cur.executemany('''
    INSERT INTO train_schedules (train_code, line, origin_station, destination_station, departure_time, arrival_time, frequency_mins, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', schedules_data)

    # Seed Alerts for Bengaluru Stations
    alerts_data = [
        (4, 'Overcrowding', 'Critical', 'Nadaprabhu Kempegowda Station, Majestic passenger density has reached 86.1% (1,550 passengers). Recommend immediate dispatch of 2 extra trains.', 'Active'),
        (13, 'Overcrowding Warning', 'Critical', 'Central Silk Board passenger inflow spiking rapidly during morning rush hour (86.0% capacity).', 'Active'),
        (2, 'Schedule Delay', 'Medium', 'Train TR-P102 on Purple Line delayed by 6 minutes near Krishnarajapura (K.R. Pura).', 'Active')
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
