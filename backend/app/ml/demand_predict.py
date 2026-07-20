import os
import joblib
import pandas as pd

# -----------------------------
# Get Current Directory
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -----------------------------
# Load Model
# -----------------------------
model = joblib.load(os.path.join(BASE_DIR, "demand_model.pkl"))

# -----------------------------
# Load Encoders
# -----------------------------
station_encoder = joblib.load(os.path.join(BASE_DIR, "station_encoder.pkl"))
day_encoder = joblib.load(os.path.join(BASE_DIR, "day_encoder.pkl"))
demand_encoder = joblib.load(os.path.join(BASE_DIR, "demand_encoder.pkl"))


# -----------------------------
# Prediction Function
# -----------------------------
def predict_demand(station, day_type):

    # Encode inputs
    station_encoded = station_encoder.transform([station])[0]
    day_encoded = day_encoder.transform([day_type])[0]

    # Create DataFrame
    input_data = pd.DataFrame({
        "Station": [station_encoded],
        "Day_Type": [day_encoded]
    })

    # Predict
    prediction = model.predict(input_data)

    # Decode prediction
    demand = demand_encoder.inverse_transform(prediction)

    return demand[0]


# -----------------------------
# Test
# -----------------------------
if __name__ == "__main__":

    result = predict_demand(
        station="Waterloo",
        day_type="Weekday"
    )

    print("Predicted Demand Level :", result)