import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/metroflow")
CSV_PATH = "/home/adi/Documents/projects/Platform-for-Metro-Crowd-Management-and-Scheduling/data/entry_exit/MTA_Subway_Turnstile_Usage_Data__2022_20260701.csv"
CHUNK_SIZE = 500_000

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def setup_stations(conn):
    print("Setting up MTA stations...")
    df_sample = pd.read_csv(CSV_PATH, nrows=100000, usecols=['C/A'])
    unique_cas = df_sample['C/A'].unique()

    station_mapping = {}
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM metro_lines WHERE name = 'MTA Subway'")
        line_id_row = cur.fetchone()
        if not line_id_row:
            cur.execute("""
                INSERT INTO metro_lines (name, color_code)
                VALUES ('MTA Subway', '#0039A6')
                RETURNING id;
            """)
            line_id = cur.fetchone()[0]
        else:
            line_id = line_id_row[0]

        for ca in unique_cas:
            cur.execute("SELECT id FROM stations WHERE name = %s", (ca,))
            station_id_row = cur.fetchone()
            if not station_id_row:
                cur.execute("""
                    INSERT INTO stations (name, line_id, latitude, longitude, layout)
                    VALUES (%s, %s, 40.7128, -74.0060, 'underground')
                    RETURNING id;
                """, (ca, line_id))
                station_id = cur.fetchone()[0]
            else:
                station_id = station_id_row[0]
            station_mapping[ca] = station_id
            
        conn.commit()
    return station_mapping, line_id

def process_chunk(df, station_mapping):
    df.columns = df.columns.str.strip()
    df['Entries'] = df['Entries'].astype(str).str.replace(',', '').astype('int64')
    df['Exits'] = df['Exits'].astype(str).str.replace(',', '').astype('int64')
    
    df['timestamp'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
    
    df['turnstile_id'] = df['C/A'] + '_' + df['Unit'] + '_' + df['SCP']
    
    df = df.sort_values(by=['turnstile_id', 'timestamp'])
    
    df['net_entries'] = df.groupby('turnstile_id')['Entries'].diff()
    df['net_exits'] = df.groupby('turnstile_id')['Exits'].diff()
    
    df = df.dropna(subset=['net_entries', 'net_exits'])
    
    df['is_valid'] = True
    invalid_mask = (df['net_entries'] < 0) | (df['net_exits'] < 0) | (df['net_entries'] > 10000) | (df['net_exits'] > 10000)
    df.loc[invalid_mask, 'is_valid'] = False
    
    df['station_id'] = df['C/A'].map(station_mapping)
    
    return df

def insert_turnstile_readings(conn, df):
    with conn.cursor() as cur:
        insert_query = """
            INSERT INTO turnstile_readings 
            (station_id, turnstile_id, timestamp, entries_cumulative, exits_cumulative, net_entries, net_exits, is_valid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        data = [
            (
                row.station_id,
                row.turnstile_id,
                row.timestamp,
                row.Entries,
                row.Exits,
                int(row.net_entries),
                int(row.net_exits),
                bool(row.is_valid)
            )
            for row in df.itertuples(index=False)
            if pd.notnull(row.station_id)
        ]
        
        execute_batch(cur, insert_query, data, page_size=1000)
    conn.commit()

def aggregate_crowd_readings(conn):
    print("Aggregating to crowd_readings...")
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO crowd_readings (station_id, timestamp, entry_count, exit_count, current_occupancy, source)
            SELECT station_id, 
                   date_trunc('hour', timestamp) + 
                     (EXTRACT(hour FROM timestamp)::int / 4 * 4) * INTERVAL '1 hour' as period,
                   SUM(CASE WHEN is_valid THEN net_entries ELSE 0 END),
                   SUM(CASE WHEN is_valid THEN net_exits ELSE 0 END),
                   SUM(CASE WHEN is_valid THEN net_entries - net_exits ELSE 0 END),
                   'turnstile'
            FROM turnstile_readings
            GROUP BY station_id, period
            ORDER BY station_id, period
            ON CONFLICT DO NOTHING;
        """)
    conn.commit()
    print("Aggregation complete.")

def main():
    print("Connecting to database...")
    conn = get_db_connection()
    try:
        station_mapping, line_id = setup_stations(conn)
        
        total_processed = 0
        total_valid = 0
        total_invalid = 0
        
        print("Starting chunk processing...")
        for i, chunk in enumerate(pd.read_csv(CSV_PATH, chunksize=CHUNK_SIZE)):
            new_cas = set(chunk['C/A'].unique()) - set(station_mapping.keys())
            if new_cas:
                with conn.cursor() as cur:
                    for ca in new_cas:
                        cur.execute("SELECT id FROM stations WHERE name = %s", (ca,))
                        station_id_row = cur.fetchone()
                        if not station_id_row:
                            cur.execute("""
                                INSERT INTO stations (name, line_id, latitude, longitude, layout)
                                VALUES (%s, %s, 40.7128, -74.0060, 'underground')
                                RETURNING id;
                            """, (ca, line_id))
                            station_id = cur.fetchone()[0]
                        else:
                            station_id = station_id_row[0]
                        station_mapping[ca] = station_id
                conn.commit()

            df_processed = process_chunk(chunk, station_mapping)
            insert_turnstile_readings(conn, df_processed)
            
            valid_count = df_processed['is_valid'].sum()
            invalid_count = len(df_processed) - valid_count
            
            total_processed += len(chunk)
            total_valid += valid_count
            total_invalid += invalid_count
            
            print(f"Processed chunk {i+1}: {total_processed} total rows. (Valid in chunk: {valid_count}, Invalid: {invalid_count})")
            
        aggregate_crowd_readings(conn)
        print(f"Finished processing! Total rows read: {total_processed}, Total Valid (diffs): {total_valid}, Total Invalid (diffs): {total_invalid}")
        
    finally:
        conn.close()

if __name__ == "__main__":
    main()
