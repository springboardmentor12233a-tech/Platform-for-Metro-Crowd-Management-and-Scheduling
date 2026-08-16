from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor


# ============================================================
# PATHS & CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

TRAINING_FILE = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "delay_training.csv"
)

MODEL_DIR = (
    BASE_DIR
    / "ml"
    / "models"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

MODEL_PATH = (
    MODEL_DIR
    / "delay_xgboost.pkl"
)

RANDOM_STATE = 42


print("=" * 60)
print("DELAY PREDICTION MODEL TRAINING")
print("=" * 60)

print(f"Loading training data from: {TRAINING_FILE}")

if not TRAINING_FILE.exists():
    raise FileNotFoundError(
        f"Training dataset not found at {TRAINING_FILE}. Run the preprocessing script first."
    )

df = pd.read_csv(TRAINING_FILE)

print(f"Dataset shape: {df.shape}")


# ============================================================
# FEATURES & TARGET DEFINITION
# ============================================================

FEATURES = [
    "transport_type",
    "route_id",
    "scheduled_departure_min",
    "scheduled_arrival_min",
    "travel_duration",
    "departure_hour",
    "weather_condition",
    "temperature_c",
    "humidity_percent",
    "wind_speed_kmh",
    "precipitation_mm",
    "weather_severity",
    "event_type",
    "event_attendance_est",
    "event_severity",
    "event_impact",
    "traffic_congestion_index",
    "traffic_severity",
    "traffic_weather_score",
    "rush_hour_score",
    "holiday",
    "peak_hour",
    "weekday",
    "season",
    "month",
    "day_of_week",
    "is_weekend",
    "is_extreme_weather",
]

TARGET = "actual_departure_delay_min"

missing_features = [f for f in FEATURES if f not in df.columns]
if missing_features:
    raise ValueError(f"Features missing from dataframe: {missing_features}")

if TARGET not in df.columns:
    raise ValueError(f"Target column '{TARGET}' missing from dataframe.")


X = df[FEATURES].copy()
y = df[TARGET].copy()


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=RANDOM_STATE,
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# ============================================================
# MODEL TRAINING (XGBOOST REGRESSOR)
# ============================================================

print()
print("Training XGBoost Regressor...")

model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=6,
    random_state=RANDOM_STATE,
    n_jobs=-1,
)

model.fit(X_train, y_train)


# ============================================================
# MODEL EVALUATION
# ============================================================

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print()
print("=" * 60)
print("MODEL PERFORMANCE METRICS")
print("=" * 60)
print(f"Mean Absolute Error (MAE): {mae:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
print(f"R2 Score: {r2:.4f}")


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    model,
    MODEL_PATH,
)

print()
print(f"Trained model successfully saved to: {MODEL_PATH}")
print("=" * 60)
print("DELAY MODEL TRAINING COMPLETED")
print("=" * 60)