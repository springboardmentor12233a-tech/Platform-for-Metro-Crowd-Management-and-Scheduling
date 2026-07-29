from pathlib import Path

import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder


# ======================================================
# Paths
# ======================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "datasets"
OUTPUT_DIR = BASE_DIR / "ml" / "data" / "processed"
MODEL_DIR = BASE_DIR / "ml" / "models"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ======================================================
# Input CSV
# ======================================================

INPUT_FILE = DATA_DIR / "crowd_history_preprocessed.csv"

OUTPUT_FILE = OUTPUT_DIR / "ridership_training.csv"

print("=" * 60)
print(" Ridership Data Preprocessing ")
print("=" * 60)

print(f"\nLoading: {INPUT_FILE}")

df = pd.read_csv(INPUT_FILE)

print(f"Rows Loaded : {len(df)}")


# ======================================================
# Timestamp
# ======================================================

df["timestamp"] = pd.to_datetime(df["timestamp"])


# ======================================================
# Feature Engineering
# ======================================================

df["hour"] = df["timestamp"].dt.hour
df["day"] = df["timestamp"].dt.day
df["month"] = df["timestamp"].dt.month
df["day_of_week"] = df["timestamp"].dt.dayofweek

df["weekend"] = (
    df["day_of_week"]
    .isin([5, 6])
    .astype(int)
)


# ======================================================
# Encode Station Name
# ======================================================

station_encoder = LabelEncoder()

df["station_name"] = station_encoder.fit_transform(
    df["station_name"]
)

joblib.dump(
    station_encoder,
    MODEL_DIR / "ridership_station_encoder.pkl"
)

print("\nStation Encoder Saved")


# ======================================================
# Remove Unnecessary Columns
# ======================================================

df.drop(
    columns=[
        "id",
        "timestamp",
        "crowd_density"
    ],
    inplace=True
)

# ======================================================
# Missing Values
# ======================================================

df.dropna(inplace=True)

df.drop_duplicates(inplace=True)

df.reset_index(drop=True, inplace=True)


# ======================================================
# Save Dataset
# ======================================================

df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nPreprocessing Completed Successfully")

print(f"\nSaved To:\n{OUTPUT_FILE}")

print("\nColumns:")

print(df.columns.tolist())

print("\nFirst Five Rows:\n")

print(df.head())