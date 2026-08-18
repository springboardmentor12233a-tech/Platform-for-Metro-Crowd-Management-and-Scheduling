import joblib
import pandas as pd
from pathlib import Path

# -------------------------------------------------
# MODEL PATH
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR.parent
    / "ml"
    / "models"
    / "crowd_prediction_model.pkl"
)

# -------------------------------------------------
# LOAD MODEL
# -------------------------------------------------

model = joblib.load(MODEL_PATH)

print("Crowd prediction model loaded successfully!")


# -------------------------------------------------
# PREDICTION FUNCTION
# -------------------------------------------------

def predict_crowd(data):

    df = pd.DataFrame([data])

    prediction = model.predict(df)

    return float(prediction[0])