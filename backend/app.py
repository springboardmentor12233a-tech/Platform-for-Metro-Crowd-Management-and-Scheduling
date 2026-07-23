from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# Create FastAPI app
app = FastAPI(title="MetroFlow AI Prediction API")

# Load Model and Encoders
model = joblib.load("model/passenger_prediction_model.pkl")
encoders = joblib.load("model/label_encoders.pkl")

# Input Schema
class PassengerInput(BaseModel):
    From_Station: str
    To_Station: str
    Distance_km: float
    Fare: float
    Cost_per_passenger: float
    Ticket_Type: str
    Year: int
    Month: int
    Day: int
    Day_Name: str
    Is_Weekend: bool
    Route: str


# Home Route
@app.get("/")
def home():
    return {"message": "MetroFlow AI Backend Running Successfully 🚇"}


# Prediction Route
@app.post("/predict")
def predict(data: PassengerInput):

    # Encode categorical values
    from_station = encoders["From_Station"].transform([data.From_Station])[0]
    to_station = encoders["To_Station"].transform([data.To_Station])[0]
    ticket_type = encoders["Ticket_Type"].transform([data.Ticket_Type])[0]
    day_name = encoders["Day_Name"].transform([data.Day_Name])[0]
    route = encoders["Route"].transform([data.Route])[0]

    # Create DataFrame
    input_data = pd.DataFrame([{
        "From_Station": from_station,
        "To_Station": to_station,
        "Distance_km": data.Distance_km,
        "Fare": data.Fare,
        "Cost_per_passenger": data.Cost_per_passenger,
        "Ticket_Type": ticket_type,
        "Year": data.Year,
        "Month": data.Month,
        "Day": data.Day,
        "Day_Name": day_name,
        "Is_Weekend": data.Is_Weekend,
        "Route": route
    }])

    # Predict
    prediction = model.predict(input_data)[0]

    # Occupancy
    occupancy = (prediction / 30) * 100

    # Capacity Status
    if occupancy < 60:
        status = "Normal"
        recommendation = "Maintain Current Schedule"
        frequency = "Every 8 Minutes"
        delay = "Low"

    elif occupancy < 90:
        status = "Busy"
        recommendation = "Monitor Crowd"
        frequency = "Every 5 Minutes"
        delay = "Medium"

    else:
        status = "Overloaded"
        recommendation = "Increase Train Frequency"
        frequency = "Every 3 Minutes"
        delay = "High"

    return {
        "Predicted Passengers": round(float(prediction), 2),
        "Occupancy (%)": round(float(occupancy), 2),
        "Capacity Status": status,
        "AI Recommendation": recommendation,
        "Recommended Frequency": frequency,
        "Delay Risk": delay
    }