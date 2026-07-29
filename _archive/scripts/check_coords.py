import pandas as pd

df = pd.read_csv('datasets/Delhi-Metro-Network.csv')
anomalies = df[
    (df['Latitude'] < 28.3) | (df['Latitude'] > 28.9) | 
    (df['Longitude'] < 76.9) | (df['Longitude'] > 77.5)
]
print('Anomalies found:', len(anomalies))
for idx, row in anomalies.iterrows():
    print(f"{row['Station Name']} ({row['Line']}): Lat {row['Latitude']}, Lng {row['Longitude']}")
