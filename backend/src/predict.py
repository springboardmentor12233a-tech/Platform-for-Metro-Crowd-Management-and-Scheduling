import os
import joblib
import pandas as pd

# ==============================
# Get Backend Folder
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ==============================
# Model Paths
# ==============================

MODEL_PATH = os.path.join(BASE_DIR, "models", "metro_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoders.pkl")

# ==============================
# Load Model
# ==============================

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
encoders = joblib.load(ENCODER_PATH)

# ==============================
# Prediction Function
# ==============================

def predict_crowd(data):

    df = pd.DataFrame([data])

    # Encode categorical columns
    categorical_columns = [
        "Date",
        "Time",
        "Day",
        "Weather",
        "Station",
        "From_Station",
        "To_Station"
    ]

    for col in categorical_columns:
        df[col] = encoders[col].transform(df[col])

    # Scale numerical columns
    numerical_columns = [
        "Is_Holiday",
        "Passenger_Entries",
        "Passenger_Exits",
        "Passenger_Count",
        "Occupancy_Percent",
        "Train_Speed_kmph",
        "Number_of_Trips",
        "Delay_Minutes",
        "Peak_Hour",
        "Train_Frequency_Per_Hour"
    ]

    df[numerical_columns] = scaler.transform(df[numerical_columns])

    prediction = model.predict(df)[0]

    # Decode prediction
    crowd_level = encoders["Crowd_Level"].inverse_transform([prediction])[0]

    return crowd_level