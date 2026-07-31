"""
MetroFlow ML — Configuration
All constants, hyperparameters, and feature definitions in one place.
"""

import os

# ── Database ─────────────────────────────────────────────
DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/metroflow",
)

# ── Paths ────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models_ml")

# ── Data Cleaning ────────────────────────────────────────
MIN_STATION_READINGS = 1000
OUTLIER_PERCENTILE = 0.99

# ── Train/Test Split ─────────────────────────────────────
SPLIT_DATE = "2022-10-01"

# ── Features ─────────────────────────────────────────────
FEATURES = [
    "hour", "time_block", "day_of_week", "is_weekend", "month",
    "is_interchange", "max_capacity",
    "lag_1", "lag_2", "lag_3",
    "rolling_mean_3", "rolling_std_3", "entry_exit_ratio",
]

# ── Model Hyperparameters ────────────────────────────────
MODEL_VERSION = "v1"

MODEL_PARAMS = dict(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42,
    verbose=0,
)
