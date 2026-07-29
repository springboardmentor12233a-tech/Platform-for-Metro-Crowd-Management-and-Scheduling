from pathlib import Path

import joblib

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_DIR = BASE_DIR / "ml" / "models"

# ==========================================================
# Crowd Prediction
# ==========================================================

crowd_model = joblib.load(
    MODEL_DIR / "crowd_xgboost.pkl"
)

station_encoder = joblib.load(
    MODEL_DIR / "station_encoder.pkl"
)

crowd_label_encoder = joblib.load(
    MODEL_DIR / "crowd_label_encoder.pkl"
)

# ==========================================================
# Ridership Prediction
# ==========================================================

entry_model = joblib.load(
    MODEL_DIR / "entry_xgboost.pkl"
)

exit_model = joblib.load(
    MODEL_DIR / "exit_xgboost.pkl"
)

ridership_station_encoder = joblib.load(
    MODEL_DIR / "ridership_station_encoder.pkl"
)