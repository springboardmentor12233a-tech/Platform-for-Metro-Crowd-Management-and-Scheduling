import joblib
import os
from datetime import datetime

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_models")

model = joblib.load(os.path.join(MODEL_DIR, "crowd_demand_model.pkl"))
station_encoder = joblib.load(os.path.join(MODEL_DIR, "station_encoder.pkl"))
line_encoder = joblib.load(os.path.join(MODEL_DIR, "line_encoder.pkl"))
day_encoder = joblib.load(os.path.join(MODEL_DIR, "day_encoder.pkl"))

# Known interchange line counts (matches what the model was trained on)
# Falls back to 1 for any station not explicitly listed here
STATION_LINE_COUNTS = {
    "Kashmere Gate": 3,
    "Hauz Khas": 2,
    "Sikandarpur": 2,
    "Dhaula Kuan": 2,
    "Dilli Haat INA": 2,
    "Inderlok": 2,
    "Dwarka Sector 21": 2,
    "New Delhi": 2,
    "Lajpat Nagar": 2,
    "Netaji Subhash Place": 2,
    "Rajiv Chowk": 3,
    "Central Secretariat": 2,
}


def predict_crowd(station_name: str, line: str, hour: int, day_of_week: str = None):
    """
    Predicts expected passenger count for a given station, line, and hour.
    If day_of_week is not provided, uses the current day.
    """
    if day_of_week is None:
        day_of_week = datetime.now().strftime("%A")

    try:
        station_encoded = station_encoder.transform([station_name])[0]
    except ValueError:
        station_encoded = 0  # unseen station, fallback

    try:
        line_encoded = line_encoder.transform([line])[0]
    except ValueError:
        line_encoded = 0

    try:
        day_encoded = day_encoder.transform([day_of_week])[0]
    except ValueError:
        day_encoded = 0

    line_count = STATION_LINE_COUNTS.get(station_name, 1)
    is_weekend = 1 if day_of_week in ["Saturday", "Sunday"] else 0

    features = [[station_encoded, line_encoded, line_count, hour, day_encoded, is_weekend]]
    predicted_passengers = model.predict(features)[0]

    return {
        "station": station_name,
        "line": line,
        "hour": hour,
        "day_of_week": day_of_week,
        "predicted_passengers": round(float(predicted_passengers), 1),
    }