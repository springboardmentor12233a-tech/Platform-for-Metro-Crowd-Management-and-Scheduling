import joblib
import pandas as pd
from pathlib import Path

# Load the trained model
MODEL_PATH = Path(__file__).parent / "passenger_prediction_model.pkl"

model = joblib.load(MODEL_PATH)


def predict_passengers(data: dict):
    """
    Predict passenger count using the trained ML model.
    """

    input_df = pd.DataFrame([data])

    prediction = model.predict(input_df)

    return int(round(prediction[0]))