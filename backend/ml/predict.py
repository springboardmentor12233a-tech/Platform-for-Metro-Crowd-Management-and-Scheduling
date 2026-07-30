import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "crowd_prediction_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_crowd(data):
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return float(prediction[0])