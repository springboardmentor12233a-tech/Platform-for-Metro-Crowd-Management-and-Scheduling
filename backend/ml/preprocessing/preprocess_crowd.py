"""
Crowd Prediction Data Preprocessing

Author: Ankita Jana
Project: Metro Crowd Management System
"""

from pathlib import Path

import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET = BASE_DIR / "datasets" / "crowd_history_preprocessed.csv"

OUTPUT = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "crowd_training.csv"
)

MODELS_DIR = BASE_DIR / "ml" / "models"


# ==========================================================
# Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Crowd History Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(df.head())
print()

print(df.shape)
print()

print(df.info())

# ==========================================================
# Remove ID
# ==========================================================

columns_to_drop = ["id", "record_id"]

df.drop(
    columns=[c for c in columns_to_drop if c in df.columns],
    inplace=True,
)

# ==========================================================
# Timestamp Features
# ==========================================================

df["timestamp"] = pd.to_datetime(df["timestamp"])

df["hour"] = df["timestamp"].dt.hour
df["day"] = df["timestamp"].dt.day
df["month"] = df["timestamp"].dt.month
df["day_of_week"] = df["timestamp"].dt.dayofweek
df["weekend"] = (df["day_of_week"] >= 5).astype(int)

df.drop(columns=["timestamp"], inplace=True)

# ==========================================================
# Crowd Level Creation
# ==========================================================

def create_crowd_level(value):

    if value < 0.25:
        return "Low"

    elif value < 0.50:
        return "Medium"

    elif value < 0.75:
        return "High"

    else:
        return "Very High"


df["crowd_level"] = df["crowd_density"].apply(create_crowd_level)

# ==========================================================
# Encode Station Name
# ==========================================================

station_encoder = LabelEncoder()

df["station_name"] = station_encoder.fit_transform(
    df["station_name"]
)

# ==========================================================
# Encode Target
# ==========================================================

target_encoder = LabelEncoder()

df["crowd_level"] = target_encoder.fit_transform(
    df["crowd_level"]
)

# ==========================================================
# Save Encoders
# ==========================================================

MODELS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

joblib.dump(
    station_encoder,
    MODELS_DIR / "station_encoder.pkl",
)

joblib.dump(
    target_encoder,
    MODELS_DIR / "crowd_label_encoder.pkl",
)
# ==========================================================
# Save Dataset
# ==========================================================

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

df.to_csv(
    OUTPUT,
    index=False,
)

print()
print("=" * 60)
print("Preprocessing Complete")
print("=" * 60)
print()

print(df.head())    

print()

print("Processed dataset saved to:")
print(OUTPUT)

print()

print("Station encoder saved to:")
print(MODELS_DIR / "station_encoder.pkl")

print()

print("Crowd label encoder saved to:")
print(MODELS_DIR / "crowd_label_encoder.pkl")