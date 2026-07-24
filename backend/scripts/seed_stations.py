import pandas as pd
import psycopg2
import math
import re

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/metroflow"
CSV_PATH = "/home/adi/Documents/projects/Platform-for-Metro-Crowd-Management-and-Scheduling/data/network_dynamics/Delhi-Metro-Network.csv"

COLOR_MAP = {
    'Red line': '#FF0000',
    'Blue line': '#0000FF',
    'Yellow line': '#FFFF00',
    'Green line': '#00FF00',
    'Violet line': '#800080',
    'Pink line': '#FFC0CB',
    'Magenta line': '#FF00FF',
    'Orange line': '#FFA500',
    'Grey line': '#808080',
    'Rapid Metro': '#00CED1',
    'Aqua line': '#00FFFF'
}

def clean_station_name(name):
    # Remove [Conn: ...] suffix
    return re.sub(r'\s*\[Conn:.*?\]\s*', '', name).strip()

def is_interchange_station(name):
    return '[Conn:' in name

def map_layout(layout):
    layout = str(layout).lower().strip()
    if 'at grade' in layout or 'at-grade' in layout:
        return 'at_grade'
    elif 'underground' in layout:
        return 'underground'
    else:
        return 'elevated'

def main():
    print(f"Reading CSV from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    
    print("Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # 1. Insert Lines
    lines = df['Line'].unique()
    lines_inserted = 0
    line_name_to_id = {}
    
    for line in lines:
        color_code = COLOR_MAP.get(line, '#000000')
        
        cursor.execute("""
            INSERT INTO metro_lines (name, color_code, status)
            VALUES (%s, %s, 'operational')
            ON CONFLICT (name) DO NOTHING
            RETURNING id;
        """, (line, color_code))
        
        row = cursor.fetchone()
        if row:
            lines_inserted += 1
            line_name_to_id[line] = row[0]
        else:
            # Fetch existing
            cursor.execute("SELECT id FROM metro_lines WHERE name = %s", (line,))
            line_name_to_id[line] = cursor.fetchone()[0]
            
    print(f"Inserted {lines_inserted} new lines (Total found: {len(lines)}).")
    
    # 2. Insert Stations
    stations_inserted = 0
    df['clean_name'] = df['Station Name'].apply(clean_station_name)
    df['is_interchange'] = df['Station Name'].apply(is_interchange_station)
    df['layout_enum'] = df['Station Layout'].apply(map_layout)
    
    station_db_ids = {} # (original_name, line) -> id
    
    for index, row in df.iterrows():
        line_name = row['Line']
        line_id = line_name_to_id[line_name]
        original_name = row['Station Name']
        clean_name = row['clean_name']
        lat = row['Latitude']
        lon = row['Longitude']
        dist = row['Distance from Start (km)']
        layout = row['layout_enum']
        is_interchange = row['is_interchange']
        
        # Check if exists (since there's no unique constraint to rely on for ON CONFLICT on name+line_id)
        cursor.execute("""
            SELECT id FROM stations WHERE name = %s AND line_id = %s
        """, (clean_name, line_id))
        
        existing = cursor.fetchone()
        if existing:
            station_id = existing[0]
        else:
            cursor.execute("""
                INSERT INTO stations (name, line_id, latitude, longitude, layout, distance_from_start_km, is_interchange)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (clean_name, line_id, lat, lon, layout, dist, is_interchange))
            station_id = cursor.fetchone()[0]
            stations_inserted += 1
            
        station_db_ids[(original_name, line_name)] = station_id
        
    print(f"Inserted {stations_inserted} new stations (Total processed: {len(df)}).")
    
    # 3. Build Connections
    connections_inserted = 0
    for line_name in lines:
        line_df = df[df['Line'] == line_name].sort_values('Distance from Start (km)')
        line_id = line_name_to_id[line_name]
        
        prev_row = None
        for index, row in line_df.iterrows():
            if prev_row is not None:
                from_station = station_db_ids[(prev_row['Station Name'], line_name)]
                to_station = station_db_ids[(row['Station Name'], line_name)]
                
                dist_km = abs(row['Distance from Start (km)'] - prev_row['Distance from Start (km)'])
                travel_time_min = dist_km * 2.5
                
                cursor.execute("""
                    INSERT INTO station_connections (from_station_id, to_station_id, line_id, distance_km, avg_travel_time_min, is_bidirectional)
                    VALUES (%s, %s, %s, %s, %s, TRUE)
                    ON CONFLICT (from_station_id, to_station_id, line_id) DO NOTHING
                    RETURNING id;
                """, (from_station, to_station, line_id, dist_km, travel_time_min))
                
                if cursor.fetchone():
                    connections_inserted += 1
                    
            prev_row = row
            
    print(f"Inserted {connections_inserted} new connections.")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    main()
