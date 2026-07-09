import sqlite3
import pandas as pd
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "metroflow.db")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def init_db():
    print("=" * 60)
    print("MetroFlow: Database Initialization")
    print("=" * 60)
    print(f"Database File: {os.path.abspath(DB_PATH)}")
    print(f"Data Directory: {os.path.abspath(DATA_DIR)}")
    
    # Connect to SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create Users Table
    print("\nCreating users table...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'operator')),
        email TEXT NOT NULL,
        name TEXT NOT NULL
    );
    """)

    # Create Alerts Resolution Table (to track operator manual overrides)
    print("Creating alerts_resolution table...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts_resolution (
        alert_id TEXT PRIMARY KEY,
        resolved_by TEXT NOT NULL,
        resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolution_notes TEXT NOT NULL,
        FOREIGN KEY(resolved_by) REFERENCES users(username)
    );
    """)

    # List of datasets and tables
    datasets = {
        "delhi_metro_ticketing.csv": "ticketing",
        "passenger_entry_exit.csv": "passenger_flow",
        "hourly_footfall.csv": "hourly_footfall",
        "station_footfall_daily.csv": "station_footfall_daily",
        "metro_ridership.csv": "metro_ridership",
        "train_occupancy.csv": "train_occupancy",
        "train_schedule.csv": "train_schedule",
        "delay_logs.csv": "delay_logs",
        "rail_transport_stats.csv": "rail_transport_stats",
        "metro_sensor_data.csv": "sensor_data"
    }

    # Import datasets from CSV using pandas
    for filename, table_name in datasets.items():
        csv_path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(csv_path):
            print(f"Warning: File {filename} not found in {DATA_DIR}. Skipping.")
            continue
            
        print(f"Importing {filename} into '{table_name}' table...")
        
        # Load CSV using pandas
        df = pd.read_csv(csv_path)
        
        # Write to SQLite
        df.to_sql(table_name, conn, if_exists="replace", index=False)
        print(f"  -> Imported {len(df):,} rows.")

    # Seed Default Users
    print("\nSeeding default users...")
    default_users = [
        ("admin", "adminpassword", "admin", "admin@metroflow.com", "System Administrator"),
        ("operator", "operatorpassword", "operator", "operator@metroflow.com", "Station Operator")
    ]
    
    for username, password, role, email, name in default_users:
        cursor.execute("""
        INSERT OR REPLACE INTO users (username, password, role, email, name)
        VALUES (?, ?, ?, ?, ?)
        """, (username, password, role, email, name))
    
    conn.commit()
    print("  -> Default users seeded.")

    # Create Performance Indexes
    print("\nCreating database indexes for query optimization...")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_flow_station ON passenger_flow(station);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_flow_date ON passenger_flow(date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_occ_train ON train_occupancy(train_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_occ_percent ON train_occupancy(occupancy_percent);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_schedule_train ON train_schedule(train_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_delay_train ON delay_logs(train_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_delay_date ON delay_logs(date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensor_type ON sensor_data(sensor_type);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensor_status ON sensor_data(status);")
    
    conn.commit()
    conn.close()
    
    print("=" * 60)
    print("DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    init_db()
