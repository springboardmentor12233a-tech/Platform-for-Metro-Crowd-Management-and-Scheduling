import pandas as pd
import json
import os

raw_dir = r'd:\Playground\Eat_Sleep_Code_Repeat\Projects\Platform-for-Metro-Crowd-Management-and-Scheduling\datasets\raw'
files = ['stations.json', 'trains.json', 'schedules.json', 'ticketing.csv', 'train-occupancy.csv', 'metro-sensordata.csv', 'delay.csv', 'ridership.csv', 'gps-status.csv']

for f in files:
    print(f'\n--- {f} ---')
    p = os.path.join(raw_dir, f)
    if not os.path.exists(p):
        print("File not found")
        continue
    if f.endswith('.csv'):
        df = pd.read_csv(p, nrows=3)
        print("Columns:", list(df.columns))
        print("Dtypes:\n", df.dtypes)
    elif f.endswith('.json'):
        with open(p, 'r') as file:
            data = json.load(file)
            if isinstance(data, list):
                print(f'List of size {len(data)}')
                if len(data) > 0:
                    print('Keys:', list(data[0].keys()))
            elif isinstance(data, dict):
                print('Dict keys:', list(data.keys()))
