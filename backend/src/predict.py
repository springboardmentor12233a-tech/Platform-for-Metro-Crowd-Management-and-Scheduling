import joblib
import pandas as pd

# Load model
model = joblib.load("models/metro_model.pkl")

# Load scaler
scaler = joblib.load("models/scaler.pkl")

# Load encoders
encoders = joblib.load("models/label_encoders.pkl")

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

categorical_columns = [
    "Date",
    "Time",
    "Day",
    "Weather",
    "Station",
    "From_Station",
    "To_Station"
]

crowd_labels = {
    0: "High",
    1: "Low",
    2: "Medium"
}


def predict_crowd(data):

    df = pd.DataFrame([data])

    # Encode categorical columns
    for col in categorical_columns:
        df[col] = encoders[col].transform(df[col])

    # Scale numerical columns
    df[numerical_columns] = scaler.transform(df[numerical_columns])

    prediction = model.predict(df)[0]

    return crowd_labels[int(prediction)]