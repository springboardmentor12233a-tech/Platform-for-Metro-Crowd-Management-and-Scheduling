import os
import joblib
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model
model = joblib.load(os.path.join(BASE_DIR, "demand_model.pkl"))

# Load encoders
station_encoder = joblib.load(
    os.path.join(BASE_DIR, "station_encoder.pkl")
)

day_encoder = joblib.load(
    os.path.join(BASE_DIR, "day_encoder.pkl")
)


def predict_demand(station, date):

    date = datetime.strptime(date, "%Y-%m-%d")

    month = date.month
    day = date.day
    day_of_week = date.weekday()

    day_type = "Weekend" if day_of_week >= 5 else "Weekday"

    station = station_encoder.transform([station])[0]
    day_type = day_encoder.transform([day_type])[0]

    input_data = pd.DataFrame({
        "From_Station": [station],
        "Month": [month],
        "Day": [day],
        "DayOfWeek": [day_of_week],
        "DayType": [day_type]
    })

    prediction = model.predict(input_data)

    passengers = round(prediction[0])

    if passengers < 15:
        level = "Low"
    elif passengers < 25:
        level = "Medium"
    else:
        level = "High"

    return {
    "predicted_passengers": passengers,
    "demand_level": level
    }


if __name__ == "__main__":

    result = predict_demand(
        station="Rajiv Chowk",
        date="2026-07-25"
    )

    print("Predicted Passengers :", result["predicted_passengers"])
    print("Demand Level :", result["demand_level"])