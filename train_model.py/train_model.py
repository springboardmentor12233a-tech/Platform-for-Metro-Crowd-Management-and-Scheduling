from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# =========================================================
# Create FastAPI app
# =========================================================

app = FastAPI(title="MetroFlow AI Prediction API")


# =========================================================
# CORS Configuration
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Load Model and Encoders
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "model")

model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "passenger_prediction_model.pkl"
    )
)

encoders = joblib.load(
    os.path.join(
        MODEL_DIR,
        "label_encoders.pkl"
    )
)


# =========================================================
# Input Schema
# =========================================================

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


# =========================================================
# Home Route
# =========================================================

@app.get("/")
def home():
    return {
        "message": "MetroFlow AI Backend Running Successfully 🚇"
    }


# =========================================================
# Prediction Route
# =========================================================

@app.post("/predict")
def predict(data: PassengerInput):

    # -----------------------------------------------------
    # Encode categorical values
    # -----------------------------------------------------

    from_station = encoders["From_Station"].transform(
        [data.From_Station]
    )[0]

    to_station = encoders["To_Station"].transform(
        [data.To_Station]
    )[0]

    ticket_type = encoders["Ticket_Type"].transform(
        [data.Ticket_Type]
    )[0]

    day_name = encoders["Day_Name"].transform(
        [data.Day_Name]
    )[0]

    # FIX:
    # Route must be encoded using the SAME encoder
    # that was used during model training.
    route = encoders["Route"].transform(
        [data.Route]
    )[0]


    # -----------------------------------------------------
    # Create input DataFrame
    # -----------------------------------------------------

    input_data = pd.DataFrame([
        {
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
        }
    ])


    # -----------------------------------------------------
    # Predict passenger demand
    # -----------------------------------------------------

    prediction = model.predict(input_data)[0]


    # -----------------------------------------------------
    # Calculate occupancy
    # -----------------------------------------------------

    occupancy = (prediction / 30) * 100


    # -----------------------------------------------------
    # Operational decision logic
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # Return prediction
    # -----------------------------------------------------

    return {
        "Predicted Passengers": round(float(prediction), 2),
        "Occupancy (%)": round(float(occupancy), 2),
        "Capacity Status": status,
        "AI Recommendation": recommendation,
        "Recommended Frequency": frequency,
        "Delay Risk": delay
    }