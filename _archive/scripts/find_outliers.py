import pandas as pd

df = pd.read_csv('datasets/Delhi-Metro-Network.csv')

def get_outliers(series):
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return (series < lower) | (series > upper)

for line in df['Line'].unique():
    line_df = df[df['Line'] == line]
    lat_outliers = line_df[get_outliers(line_df['Latitude'])]
    lng_outliers = line_df[get_outliers(line_df['Longitude'])]
    
    if len(lat_outliers) > 0 or len(lng_outliers) > 0:
        print(f"\n--- {line} Outliers ---")
        outlier_idx = lat_outliers.index.union(lng_outliers.index)
        for idx in outlier_idx:
            row = df.loc[idx]
            print(f"{row['Station Name']}: Lat {row['Latitude']}, Lng {row['Longitude']}")
