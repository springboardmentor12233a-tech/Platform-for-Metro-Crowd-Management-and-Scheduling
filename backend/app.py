from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="MetroFlow AI Prediction API",
    description="AI-powered metro passenger prediction and crowd analysis API",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

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


# ============================================================
# BASE DIRECTORIES
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "..",
    "model"
)


# ============================================================
# LOAD ML MODEL AND ENCODERS
# ============================================================

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "passenger_prediction_model.pkl"
)

ENCODER_PATH = os.path.join(
    MODEL_DIR,
    "label_encoders.pkl"
)

model = None
encoders = {}

try:

    if os.path.exists(MODEL_PATH):

        model = joblib.load(MODEL_PATH)

        print("ML model loaded successfully.")

    else:

        print("WARNING: ML model file not found:")
        print(MODEL_PATH)


    if os.path.exists(ENCODER_PATH):

        encoders = joblib.load(ENCODER_PATH)

        print("Label encoders loaded successfully.")

    else:

        print("WARNING: Label encoder file not found:")
        print(ENCODER_PATH)


except Exception as error:

    print("WARNING: Unable to load ML model or encoders.")
    print("Error:", error)

    model = None
    encoders = {}

# ============================================================
# LOAD AI CROWD FORECAST MODEL
# ============================================================

CROWD_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "metro_crowd_model.pkl"
)

crowd_model = None

try:

    if os.path.exists(CROWD_MODEL_PATH):

        crowd_model = joblib.load(
            CROWD_MODEL_PATH
        )

        print(
            "AI crowd forecasting model loaded successfully."
        )

    else:

        print(
            "WARNING: AI crowd model file not found:"
        )

        print(
            CROWD_MODEL_PATH
        )

except Exception as error:

    print(
        "WARNING: Unable to load AI crowd model."
    )

    print(
        "Error:",
        error
    )

    crowd_model = None

# ============================================================
# LOAD METRO OPERATIONAL DATA
# ============================================================

DATA_FILE = os.path.join(
    BASE_DIR,
    "data",
    "MetroFlow_Dataset.xlsx"
)

metro_data = pd.DataFrame()


try:

    metro_data = pd.read_excel(DATA_FILE)

    # --------------------------------------------------------
    # Validate required columns
    # --------------------------------------------------------

    required_columns = [
        "Date",
        "Time",
        "Station",
        "Passenger_Count",
        "Occupancy_Percent",
        "Crowd_Level",
        "Number_of_Trips",
        "Delay_Minutes",
        "Congestion_Level",
        "Peak_Hour",
        "Train_Frequency_Per_Hour",
        "Train_Speed_kmph",
        "AI_Recommendation"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in metro_data.columns
    ]

    if missing_columns:

        print(
            "WARNING: Missing columns in MetroFlow_Dataset.xlsx:"
        )

        print(missing_columns)

        metro_data = pd.DataFrame()

    else:

        # ----------------------------------------------------
        # Normalize Date
        # ----------------------------------------------------

        metro_data["Date"] = pd.to_datetime(
            metro_data["Date"],
            errors="coerce"
        ).dt.strftime("%Y-%m-%d")


        # ----------------------------------------------------
        # Normalize Time
        # ----------------------------------------------------

        metro_data["Time"] = (
            metro_data["Time"]
            .astype(str)
            .str.strip()
            .str[:5]
        )


        # ----------------------------------------------------
        # Normalize Station
        # ----------------------------------------------------

        metro_data["Station"] = (
            metro_data["Station"]
            .astype(str)
            .str.strip()
        )


        print(
            "Metro operational dataset loaded successfully."
        )

        print(
            f"Rows: {len(metro_data)}"
        )

        print(
            f"Stations available: "
            f"{metro_data['Station'].nunique()}"
        )


except Exception as error:

    print(
        "WARNING: Unable to load MetroFlow_Dataset.xlsx"
    )

    print("Error:", error)

    metro_data = pd.DataFrame()


# ============================================================
# CROWD DATA STATION MAPPING
# ============================================================
#
# The crowd dataset contains synthetic station names such as:
#
# Airport
# University
# Central
# North Gate
# South Gate
# Stadium
# Market
# Rail Hub
# Tech Park
# City Center
#
# The Delhi Metro UI uses real station names.
#
# Therefore, we map the real Metro station selected by the
# user to one of the existing synthetic crowd-data stations.
#
# IMPORTANT:
# This is a DEMONSTRATION / SIMULATION mapping.
# It does NOT claim that the original crowd dataset
# represents actual passenger data for these stations.
# ============================================================

CROWD_STATION_MAP = {
    "Samaypur Badli": "Airport",
    "Rohini Sector 18, 19": "Market",
    "Haiderpur Badli Mor": "University",
    "Jahangirpuri": "Central",
    "Adarsh Nagar": "North Gate",
    "Azadpur": "Stadium",
    "Model Town": "South Gate",
    "GTB Nagar": "Rail Hub",
    "Vishwavidyalaya": "Tech Park",
    "Vidhan Sabha": "City Center",

    "Civil Lines": "Airport",
    "Kashmere Gate": "Market",
    "Chandni Chowk": "University",
    "Chawri Bazar": "Central",
    "New Delhi": "North Gate",
    "Rajiv Chowk": "Stadium",
    "Patel Chowk": "South Gate",
    "Central Secretariat": "Rail Hub",
    "Udyog Bhawan": "Tech Park",
    "Lok Kalyan Marg": "City Center",

    "Jor Bagh": "Airport",
    "Dilli Haat-INA": "Market",
    "AIIMS": "University",
    "Green Park": "Central",
    "Hauz Khas": "North Gate",
    "Malviya Nagar": "Stadium",
    "Saket": "South Gate",
    "Qutub Minar": "Rail Hub",
    "Chhatarpur": "Tech Park",
    "Sultanpur": "City Center",

    "Ghitorni": "Airport",
    "Arjan Garh": "Market",
    "Guru Dronacharya": "University",
    "Sikanderpur": "Central",
    "MG Road": "North Gate",
    "IFFCO Chowk": "South Gate",
    "Millennium City Centre Gurugram": "Rail Hub"
}

# ============================================================
# REVERSE MAPPING
# ============================================================
#
# This is useful if we ever need to convert the internal
# dataset station name back to the Metro station name.
# ============================================================

DATASET_TO_METRO = {
    value: key
    for key, value in CROWD_STATION_MAP.items()
}


# ============================================================
# INPUT SCHEMA FOR ML PREDICTION
# ============================================================

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


# ============================================================
# HOME ROUTE
# ============================================================

@app.get("/")
def home():

    return {

        "message": "MetroFlow AI Backend Running Successfully 🚇",

        "status": "online",

        "services": [
            "Passenger Prediction",
            "Crowd Analysis",
            "Station Search"
        ]

    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {

        "status": "healthy",

        "model_loaded": model is not None,

        "operational_data_loaded": not metro_data.empty,

        "operational_records": len(metro_data)

    }


# ============================================================
# GET AVAILABLE DATASET STATIONS
# ============================================================
#
# This endpoint shows the ORIGINAL stations inside the
# operational Excel dataset.
#
# We keep this endpoint unchanged because other parts of
# your project may depend on it.
# ============================================================

@app.get("/stations")
def get_stations():

    if metro_data.empty:

        return {

            "success": False,

            "message": "Metro operational dataset is not loaded."

        }


    stations = sorted(

        metro_data["Station"]
        .dropna()
        .unique()
        .tolist()

    )


    return {

        "success": True,

        "count": len(stations),

        "stations": stations

    }


# ============================================================
# GET CROWD-SUPPORTED REAL METRO STATIONS
# ============================================================
#
# This is the endpoint that CrowdPrediction.jsx should use.
#
# It returns REAL Delhi Metro station names instead of
# synthetic dataset names.
# ============================================================

@app.get("/crowd-stations")
def get_crowd_stations():

    stations = list(
        CROWD_STATION_MAP.keys()
    )

    return {

        "success": True,

        "count": len(stations),

        "stations": stations

    }


# ============================================================
# GET CROWD STATION MAPPING
# ============================================================
#
# Useful for debugging.
#
# Example:
#
# Rohini Sector 18, 19 -> Market
#
# This endpoint is optional but useful while developing.
# ============================================================

@app.get("/crowd-station-mapping")
def get_crowd_station_mapping():

    return {

        "success": True,

        "mapping": CROWD_STATION_MAP,

        "note": (
            "This mapping connects real Delhi Metro station "
            "names to synthetic crowd-data station labels "
            "for demonstration purposes."
        )

    }


# ============================================================
# PASSENGER PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: PassengerInput):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:

        return {

            "success": False,

            "message": "ML model is not loaded."

        }


    try:

        # ----------------------------------------------------
        # Encode categorical values
        # ----------------------------------------------------

        from_station = encoders[
            "From_Station"
        ].transform(
            [data.From_Station]
        )[0]


        to_station = encoders[
            "To_Station"
        ].transform(
            [data.To_Station]
        )[0]


        ticket_type = encoders[
            "Ticket_Type"
        ].transform(
            [data.Ticket_Type]
        )[0]


        day_name = encoders[
            "Day_Name"
        ].transform(
            [data.Day_Name]
        )[0]


        # ----------------------------------------------------
        # Current model uses Route = 0
        # ----------------------------------------------------

        route = 0


        # ----------------------------------------------------
        # Create model input
        # ----------------------------------------------------

        input_data = pd.DataFrame([

            {

                "From_Station": from_station,

                "To_Station": to_station,

                "Distance_km": data.Distance_km,

                "Fare": data.Fare,

                "Cost_per_passenger":
                    data.Cost_per_passenger,

                "Ticket_Type": ticket_type,

                "Year": data.Year,

                "Month": data.Month,

                "Day": data.Day,

                "Day_Name": day_name,

                "Is_Weekend": data.Is_Weekend,

                "Route": route

            }

        ])


        # ----------------------------------------------------
        # Predict passengers
        # ----------------------------------------------------

        prediction = model.predict(
            input_data
        )[0]


        prediction = float(prediction)


        # ----------------------------------------------------
        # Calculate occupancy
        # ----------------------------------------------------

        occupancy = (
            prediction / 30
        ) * 100


        # ----------------------------------------------------
        # Determine crowd status
        # ----------------------------------------------------

        if occupancy < 60:

            status = "Normal"

            recommendation = (
                "Maintain Current Schedule"
            )

            frequency = (
                "Every 8 Minutes"
            )

            delay = "Low"


        elif occupancy < 90:

            status = "Busy"

            recommendation = (
                "Monitor Crowd"
            )

            frequency = (
                "Every 5 Minutes"
            )

            delay = "Medium"


        else:

            status = "Overloaded"

            recommendation = (
                "Increase Train Frequency"
            )

            frequency = (
                "Every 3 Minutes"
            )

            delay = "High"


        # ----------------------------------------------------
        # Return prediction
        # ----------------------------------------------------

        return {

            "success": True,

            "Predicted Passengers":
                round(prediction, 2),

            "Occupancy (%)":
                round(occupancy, 2),

            "Capacity Status":
                status,

            "AI Recommendation":
                recommendation,

            "Recommended Frequency":
                frequency,

            "Delay Risk":
                delay

        }


    except Exception as error:

        return {

            "success": False,

            "message":
                "Prediction failed.",

            "error":
                str(error)

        }


# ============================================================
# CROWD ANALYSIS
# ============================================================


@app.get("/crowd-prediction")
def crowd_prediction(
    station: str,
    date: str,
    time: str
):
    # ========================================================
    # CHECK OPERATIONAL DATASET
    # ========================================================

    if metro_data.empty:
        return {
            "success": False,
            "message": "Metro operational dataset is not loaded."
        }

    # ========================================================
    # CLEAN USER INPUT
    # ========================================================

    station_input = station.strip().lower()
    date_input = date.strip()
    time_input = time.strip()

    # ========================================================
    # REAL METRO STATION -> SYNTHETIC DATASET STATION
    # ========================================================

    station_mapping = {
        key.lower(): value
        for key, value in CROWD_STATION_MAP.items()
    }

    if station_input not in station_mapping:
        return {
            "success": False,
            "message": (
                f"Crowd analysis is not available "
                f"for station '{station}'."
            ),
            "available_stations": sorted(
                CROWD_STATION_MAP.keys()
            )
        }

    dataset_station = station_mapping[station_input]

    # ========================================================
    # VALIDATE DATE
    # ========================================================

    try:
        formatted_date = pd.to_datetime(
            date_input
        ).strftime("%Y-%m-%d")
    except Exception:
        return {
            "success": False,
            "message": "Invalid date format. Use YYYY-MM-DD."
        }

    # ========================================================
    # VALIDATE TIME
    # ========================================================

    try:
        formatted_time = pd.to_datetime(
            time_input,
            format="%H:%M"
        ).strftime("%H:%M")
    except ValueError:
        return {
            "success": False,
            "message": "Invalid time format. Use HH:MM."
        }

    # ========================================================
    # NORMALIZE DATE
    # ========================================================

    data = metro_data.copy()

    data["Date_Normalized"] = pd.to_datetime(
        data["Date"],
        errors="coerce"
    ).dt.strftime("%Y-%m-%d")

    # ========================================================
    # FILTER BY STATION + DATE
    # ========================================================

    station_date_data = data[
        (
            data["Station"]
            .astype(str)
            .str.strip()
            .str.lower()
            == dataset_station.strip().lower()
        )
        &
        (
            data["Date_Normalized"]
            == formatted_date
        )
    ].copy()

    if station_date_data.empty:
        return {
            "success": False,
            "message": (
                f"No crowd data found for "
                f"{station} on {formatted_date}."
            ),
            "dataset_station": dataset_station
        }

    # ========================================================
    # NORMALIZE TIME
    # ========================================================

    station_date_data["Time_Parsed"] = pd.to_datetime(
        station_date_data["Time"]
        .astype(str)
        .str.strip(),
        format="%H:%M",
        errors="coerce"
    )

    station_date_data = station_date_data.dropna(
        subset=["Time_Parsed"]
    )

    if station_date_data.empty:
        return {
            "success": False,
            "message": (
                f"No valid time data found for "
                f"{station} on {formatted_date}."
            ),
            "dataset_station": dataset_station
        }

    # ========================================================
    # REQUESTED TIME -> MINUTES
    # ========================================================

    requested_time = pd.to_datetime(
        formatted_time,
        format="%H:%M"
    )

    requested_minutes = (
        requested_time.hour * 60
        + requested_time.minute
    )

    # ========================================================
    # DATASET TIME -> MINUTES
    # ========================================================

    station_date_data["Time_Minutes"] = (
        station_date_data["Time_Parsed"].dt.hour * 60
        + station_date_data["Time_Parsed"].dt.minute
    )

    # ========================================================
    # FIND CLOSEST AVAILABLE TIME
    # ========================================================

    station_date_data["Time_Difference"] = (
        station_date_data["Time_Minutes"]
        - requested_minutes
    ).abs()

    # ========================================================
    # PREFER EXACT MATCH
    # ========================================================

    exact_match = station_date_data[
        station_date_data["Time_Difference"] == 0
    ]

    if not exact_match.empty:
        result = exact_match.head(1)

    else:
        # ====================================================
        # USE NEAREST 15-MINUTE OBSERVATION
        # ====================================================

        nearest_difference = station_date_data[
            "Time_Difference"
        ].min()

        if nearest_difference > 15:
            return {
                "success": False,
                "message": (
                    f"No crowd data available near "
                    f"{formatted_time} for {station}."
                ),
                "requested_time": formatted_time,
                "nearest_available_minutes": int(
                    nearest_difference
                ),
                "dataset_station": dataset_station
            }

        result = (
            station_date_data
            .sort_values(by="Time_Difference")
            .head(1)
        )

    # ========================================================
    # CHECK RESULT
    # ========================================================

    if result.empty:
        return {
            "success": False,
            "message": (
                f"No crowd data found for "
                f"{station} on {formatted_date}."
            ),
            "dataset_station": dataset_station
        }

    row = result.iloc[0]

    # ========================================================
    # SAFE CONVERSION HELPERS
    # ========================================================

    def safe_int(value):
        if pd.isna(value):
            return 0

        try:
            return int(float(value))
        except (ValueError, TypeError):
            return 0

    def safe_float(value):
        if pd.isna(value):
            return 0.0

        try:
            return round(float(value), 2)
        except (ValueError, TypeError):
            return 0.0

    def safe_string(value):
        if pd.isna(value):
            return ""

        return str(value)

    # ========================================================
    # PEAK HOUR
    # ========================================================

    peak_value = row["Peak_Hour"]

    if pd.isna(peak_value):
        peak_hour = False

    else:
        try:
            peak_hour = bool(
                int(float(peak_value))
            )

        except (ValueError, TypeError):
            peak_hour = (
                str(peak_value)
                .strip()
                .lower()
                in ["true", "yes", "1"]
            )

    # ========================================================
    # ACTUAL MATCHED DATASET TIME
    # ========================================================

    matched_time = row["Time_Parsed"].strftime("%H:%M")

    # ========================================================
    # RETURN CROWD ANALYSIS
    # ========================================================

    return {
        "success": True,

        "station": station,

        "date": formatted_date,

        "time": formatted_time,

        "matched_time": matched_time,

        "dataset_station": dataset_station,

        "passenger_count": safe_int(
            row["Passenger_Count"]
        ),

        "occupancy_percent": safe_float(
            row["Occupancy_Percent"]
        ),

        "crowd_level": safe_string(
            row["Crowd_Level"]
        ),

        "peak_hour": peak_hour,

        "number_of_trips": safe_int(
            row["Number_of_Trips"]
        ),

        "delay_minutes": safe_int(
            row["Delay_Minutes"]
        ),

        "congestion_level": safe_string(
            row["Congestion_Level"]
        ),

        "train_frequency_per_hour": safe_int(
            row["Train_Frequency_Per_Hour"]
        ),

        "train_speed_kmph": safe_float(
            row["Train_Speed_kmph"]
        ),

        "ai_recommendation": safe_string(
    row["AI_Recommendation"]
),

"passenger_entries": safe_int(
    row["Passenger_Entries"]
),

"passenger_exits": safe_int(
    row["Passenger_Exits"]
),

"weather": safe_string(
    row["Weather"]
),

"day": safe_string(
    row["Day"]
),

"is_holiday": bool(
    row["Is_Holiday"]
) if not pd.isna(row["Is_Holiday"]) else False
    }


# ============================================================
# AI CROWD FORECAST
# ============================================================

@app.get("/ai-crowd-forecast")
def ai_crowd_forecast(
    station: str,
    date: str,
    time: str,
    weather: str = "Sunny"
):

    # --------------------------------------------------------
    # CHECK AI MODEL
    # --------------------------------------------------------

    if crowd_model is None:

        return {
            "success": False,
            "message": "AI crowd forecasting model is not loaded."
        }

    # --------------------------------------------------------
    # VALIDATE DATE
    # --------------------------------------------------------

    try:

        requested_date = pd.to_datetime(
            date,
            format="%Y-%m-%d"
        )

    except Exception:

        return {
            "success": False,
            "message": "Invalid date. Use YYYY-MM-DD."
        }

    # --------------------------------------------------------
    # VALIDATE TIME
    # --------------------------------------------------------

    try:

        requested_time = pd.to_datetime(
            time,
            format="%H:%M"
        )

    except Exception:

        return {
            "success": False,
            "message": "Invalid time. Use HH:MM."
        }

    # --------------------------------------------------------
    # CREATE MODEL FEATURES
    # --------------------------------------------------------

    day_of_week = requested_date.dayofweek

    hour = requested_time.hour

    minute = requested_time.minute

    time_in_minutes = (
        hour * 60
        + minute
    )

    is_weekend = int(
        day_of_week >= 5
    )

    # --------------------------------------------------------
    # MODEL INPUT
    # --------------------------------------------------------

    input_data = pd.DataFrame([
        {
            "Station": station,
            "Weather": weather,
            "Year": requested_date.year,
            "Month": requested_date.month,
            "Day_of_Month": requested_date.day,
            "Day_of_Week": day_of_week,
            "Hour": hour,
            "Minute": minute,
            "Time_in_Minutes": time_in_minutes,
            "Is_Holiday": 0,
            "Is_Weekend_Calc": is_weekend
        }
    ])

    # --------------------------------------------------------
    # PREDICT PASSENGER DEMAND
    # --------------------------------------------------------

    try:

        prediction = float(
            crowd_model.predict(
                input_data
            )[0]
        )

    except Exception as error:

        return {
            "success": False,
            "message": "AI crowd prediction failed.",
            "error": str(error)
        }

    prediction = max(
        0,
        prediction
    )

    # --------------------------------------------------------
    # ESTIMATE OCCUPANCY
    # --------------------------------------------------------

    # Dataset maximum occupancy is approximately
    # 100% at around 2500 passengers.
    estimated_occupancy = (
        prediction / 2500
    ) * 100

    estimated_occupancy = min(
        100,
        max(
            0,
            estimated_occupancy
        )
    )

    # --------------------------------------------------------
    # DETERMINE CROWD LEVEL
    # --------------------------------------------------------

    if estimated_occupancy < 40:

        crowd_level = "Low"

        risk_level = "Low"

        recommendation = (
            "Normal operations can be maintained."
        )

    elif estimated_occupancy < 70:

        crowd_level = "Medium"

        risk_level = "Moderate"

        recommendation = (
            "Monitor passenger flow and prepare "
            "for increased demand."
        )

    else:

        crowd_level = "High"

        risk_level = "High"

        recommendation = (
            "Increase crowd monitoring and "
            "consider higher train frequency."
        )

    # --------------------------------------------------------
    # PEAK PERIOD
    # --------------------------------------------------------

    peak_period = (
        hour in [7, 8, 9, 10, 17, 18, 19, 20]
    )

    # --------------------------------------------------------
    # RETURN AI RESULT
    # --------------------------------------------------------

    return {

        "success": True,

        "prediction_type":
            "AI Passenger Demand Forecast",

        "station":
            station,

        "date":
            requested_date.strftime(
                "%Y-%m-%d"
            ),

        "time":
            requested_time.strftime(
                "%H:%M"
            ),

        "weather":
            weather,

        "predicted_passengers":
            round(
                prediction,
                2
            ),

        "estimated_occupancy_percent":
            round(
                estimated_occupancy,
                2
            ),

        "crowd_level":
            crowd_level,

        "risk_level":
            risk_level,

        "peak_period":
            peak_period,

        "ai_recommendation":
            recommendation
    }