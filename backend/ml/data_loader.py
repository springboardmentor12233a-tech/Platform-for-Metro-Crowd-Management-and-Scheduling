"""
MetroFlow ML — Data Loader
Extracts raw crowd readings from PostgreSQL.
"""

import pandas as pd
import psycopg2


def extract_data(conn) -> pd.DataFrame:
    """
    Pull crowd_readings joined with station metadata.

    Returns a DataFrame with columns:
        station_id, timestamp, entry_count, exit_count,
        max_capacity, is_interchange
    """
    query = """
        SELECT cr.station_id, cr.timestamp, cr.entry_count, cr.exit_count,
               s.max_capacity, s.is_interchange
        FROM crowd_readings cr
        JOIN stations s ON cr.station_id = s.id
        ORDER BY cr.station_id, cr.timestamp
    """
    df = pd.read_sql(query, conn)
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    print(f"[DataLoader] Loaded {len(df):,} rows, {df['station_id'].nunique()} stations")
    print(f"[DataLoader] Date range: {df['timestamp'].min()} → {df['timestamp'].max()}")
    return df
