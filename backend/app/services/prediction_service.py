import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ai",
    "models",
    "crowd_prediction.pkl"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "ai",
    "models",
    "label_encoders.pkl"
)

print("Loading AI Model...")

model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODER_PATH)

print("AI Model Loaded Successfully!")


def predict_crowd(data):
    encoded_data = {
        "Hour": data.hour,
        "Day_Name": encoders["Day_Name"].transform([data.day_name])[0],
        "Month": data.month,
        "Is_Holiday": int(data.is_holiday),
        "Weather": encoders["Weather"].transform([data.weather])[0],
        "From_Station": encoders["From_Station"].transform([data.from_station])[0],
        "To_Station": encoders["To_Station"].transform([data.to_station])[0],
        "Distance_km": data.distance_km,
        "Ticket_Type": encoders["Ticket_Type"].transform([data.ticket_type])[0],
        "Is_Interchange": int(data.is_interchange)
    }

    df = pd.DataFrame([encoded_data])

    prediction = int(model.predict(df)[0])

    if prediction < 1200:
        crowd_level = "Low"
    elif prediction < 2500:
        crowd_level = "Medium"
    elif prediction < 3500:
        crowd_level = "High"
    else:
        crowd_level = "Very High"

    return {
        "predicted_passengers": prediction,
        "crowd_level": crowd_level
    }