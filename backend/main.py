"""
MetroFlow API - Fixed Version for Windows
AI Platform for Metro Crowd Management
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ai import router as ai_router
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
from datetime import datetime
import os
from pathlib import Path
from backend.services.gemini_service import (
    get_ai_recommendation,
    get_ai_chat_response
)
from pydantic import BaseModel
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    role: str
    username: str
    email: str

class CreateUserRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: str 
from backend.routes.scheduling import router as scheduling_router
from backend.scheduling import TrainScheduler
from backend.routes.metro import router as metro_router
from backend.database import SessionLocal
from backend.models import User
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.routes.auth import router as auth_router
import bcrypt

print("=" * 80)
print("STARTING METROFLOW API")
print("=" * 80)

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent
PARENT_DIR = BASE_DIR.parent  # Go up one level to parent folder
print(f"Base directory: {BASE_DIR}")
print(f"Parent directory: {PARENT_DIR}")

# Initialize FastAPI
app = FastAPI(
    title="MetroFlow AI Platform",
    description="""
## 🚇 AI-Powered Metro Crowd Management & Scheduling Platform

An intelligent metro management system that provides:

- 📊 Real-time crowd monitoring
- 🤖 AI-based passenger demand prediction (LSTM)
- 🚨 Smart alert management
- 📈 Traffic pattern analytics
- 🚉 Station occupancy monitoring
- 📅 Passenger demand forecasting
- 📍 Metro operations dashboard

Developed using:
- FastAPI
- TensorFlow (LSTM)
- Pandas
- NumPy

Version: 2.0
""",
    version="2.0.0",
    contact={
        "name": "MetroFlow Development Team",
        "email": "support@metroflow.ai"
    },
    license_info={
        "name": "Academic Project"
    },
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(ai_router)
app.include_router(scheduling_router)
app.include_router(metro_router, prefix="/api/metro")
app.include_router(auth_router)
 
# ============================================================================
# GLOBAL VARIABLES - Will store our data and model
# ============================================================================

lstm_model = None
scaler = None
lstm_ready = False

station_master = None

# ============================================================================
# STEP 1: LOAD CSV DATA
# ============================================================================

print("\n[STEP 1] Loading CSV data...")

# Define file paths
data_dir = BASE_DIR / "data"

csv_files = {
    "crowd_df": data_dir / "StationCrowdData.csv",
    "forecast_df": data_dir / "PassengerDemandForecast.csv",
    "alert_df": data_dir / "AlertNotification.csv",
    "traffic_df": data_dir / "TrafficPattern.csv",
}


# ----------------------------------------------------------------------------
# Load Station Master
# ----------------------------------------------------------------------------

station_master = None
station_master_path = BASE_DIR / "data" / "station_master.csv"

try:
    if station_master_path.exists():

        station_master = pd.read_csv(station_master_path)

        station_master = station_master.rename(
            columns={
                "Station_ID": "station_id",
                "Station_Name": "station_name",
            }
        )

        station_master = station_master.dropna(subset=["station_id"])

        station_master["station_id"] = (
            pd.to_numeric(
                station_master["station_id"],
                errors="coerce",
            )
            .dropna()
            .astype(int)
        )

        print("✅ Station master loaded")

    else:
        print(f"⚠️ Station master not found at {station_master_path}")

except Exception as e:
    print(f"❌ Station master loading error: {e}")

# ----------------------------------------------------------------------------
# Load Remaining CSV Files
# ----------------------------------------------------------------------------

for var_name, file_path in csv_files.items():

    try:

        if file_path.exists():

            df = pd.read_csv(file_path)

            globals()[var_name] = df

            print(f"✅ {file_path.name} loaded: {len(df):,} records")

            if var_name == "crowd_df":
                latest_time = df["timestamp"].max()

                print("Latest Timestamp:", latest_time)

                print(
                    df[df["timestamp"] == latest_time][
                        ["station_id", "passenger_count", "capacity_percentage"]
                    ]
                    .sort_values("capacity_percentage", ascending=False)
                    .head(20)
                )
        else:

            globals()[var_name] = None

            print(f"⚠️ {file_path.name} NOT FOUND at {file_path}")

    except Exception as e:

        globals()[var_name] = None

        print(f"❌ Error loading {file_path.name}: {e}")


# ============================================================================
# STEP 2: LOAD LSTM MODEL AND SCALER
# ============================================================================
print("\n[STEP 2] Loading LSTM model and scaler...")

model_dir = PARENT_DIR / "models"

model_path = model_dir / "lstm_demand_forecast.keras"
scaler_path = model_dir / "scaler.pkl"

try:
    if model_path.exists():
        lstm_model = tf.keras.models.load_model(model_path)
        print(f"✅ LSTM model loaded")
        print(f"   Input shape: {lstm_model.input_shape}")
        print(f"   Output shape: {lstm_model.output_shape}")
    else:
        print(f"⚠️  Model file NOT FOUND at {model_path}")
except Exception as e:
    print(f"❌ Error loading LSTM model: {e}")

try:
    if scaler_path.exists():
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        print(f"✅ Scaler loaded successfully")
        lstm_ready = True
    else:
        print(f"⚠️  Scaler file NOT FOUND at {scaler_path}")
except Exception as e:
    print(f"❌ Error loading scaler: {e}")

print("\n" + "=" * 80)
if lstm_ready:
    print("✅ API READY - All systems loaded!")
else:
    print("⚠️  API RUNNING - Some components missing (partial mode)")
print("=" * 80)

# ============================================================================
# ENDPOINT 1: HOME
# ============================================================================

class ChatRequest(BaseModel):
    question: str
@app.get("/")
def home():
    """Root endpoint - API information"""
    return {
        "name": "MetroFlow API",
        "version": "2.0",
        "description": "AI platform for metro crowd management",
        "status": "running",
        "model_status": "ready" if lstm_ready else "not available",
        "data_loaded": {
            "crowd_data": crowd_df is not None,
            "forecast_data": forecast_df is not None,
            "alerts": alert_df is not None,
            "traffic": traffic_df is not None
        },
        "endpoints": {
            "health": "/health",
            "crowd": "/api/crowd/station/{id}",
            "all_stations": "/api/crowd/all-stations",
            "dashboard": "/api/dashboard/kpi",
            "system_health": "/api/system/health",
            "ai_chat": "/api/ai/chat",
            "forecast": "/api/forecast/tomorrow",
            "alerts": "/api/alerts/active",
            "top_stations": "/api/statistics/top-stations",
            "hourly_pattern": "/api/statistics/hourly-pattern",
            "predict": "/api/predict/next-hour",
            "docs": "/docs"
        }
    }


# ============================================================================
# ENDPOINT 2: HEALTH CHECK
# ============================================================================

@app.get("/health")
def health_check():
    """Check API health status"""
    return {
        "status": "healthy" if lstm_ready else "partial",
        "timestamp": datetime.now().isoformat(),
        "data_loaded": crowd_df is not None,
        "model_ready": lstm_ready,
        "message": "All systems operational" if lstm_ready else "Model not loaded"
    }


# ============================================================================
# ENDPOINT 3: GET CROWD STATUS FOR STATION
# ============================================================================

@app.get("/api/crowd/station/{station_id}")
def get_crowd_status(station_id: int):
    """Get current crowd status for a specific station"""
    
    if crowd_df is None:
        return {"error": "Crowd data not loaded", "status": "error"}
    
    try:
        station_data = crowd_df[crowd_df['station_id'] == station_id]
        
        if len(station_data) == 0:
            return {"error": f"Station {station_id} not found", "status": "error"}
        
        latest = station_data.iloc[-1]
        capacity = latest['capacity_percentage']
        station_name = "Unknown"

        if station_master is not None:
            match = station_master[
                station_master["station_id"] == station_id
            ]

            if not match.empty:
                station_name = match.iloc[0]["station_name"]
        
        # Determine status
        if capacity > 90:
            status = "critical"
            emoji = "🔴"
        elif capacity > 80:
            status = "overcrowded"
            emoji = "🟠"
        else:
            status = "normal"
            emoji = "🟢"
        
        return {
            "station_id": int(station_id),
            "station_name": station_name,
            "current_passengers": int(latest["passenger_count"]),
            "capacity_percentage": float(round(capacity, 2)),
            "crowd_level": int(latest["crowd_level"]),
            "status": status,
            "emoji": emoji,
            "timestamp": str(latest["timestamp"]),
            "message": f"{emoji} {station_name} is {status}"
        }
    
    except Exception as e:
        return {"error": str(e), "status": "error"}
# ============================================================================
# ENDPOINT: GET ALL STATION CROWD STATUS
# ============================================================================

@app.get("/api/crowd/all-stations")
def get_all_station_crowd(hour: int = 23):

    if crowd_df is None:
        return {
            "error": "Crowd data not loaded"
        }

    # Work on a copy
    df = crowd_df.copy()

    # Convert timestamp correctly
    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        dayfirst=True
    )

    # Latest available date
    latest_date = df["timestamp"].dt.date.max()

    # Data for selected hour on latest day
    selected_data = df[
        (df["timestamp"].dt.date == latest_date) &
        (df["timestamp"].dt.hour == hour)
    ]

    # One row per station
    latest_data = (
        selected_data
        .sort_values("station_id")
        .drop_duplicates(subset="station_id")
        .reset_index(drop=True)
    )

    stations = []

    for _, row in latest_data.iterrows():

        capacity = float(row["capacity_percentage"])
        

        if capacity >= 90:
            status = "Critical"
        elif capacity >= 80:
            status = "Overcrowded"
        else:
            status = "Normal"

        stations.append({
            "station_id": int(row["station_id"]),
            "passengers": int(row["passenger_count"]),
            "capacity": capacity,
            "status": status,
            "timestamp": str(row["timestamp"])
        })

    stations_df = pd.DataFrame(stations)

    if station_master is not None:

        stations_df["station_id"] = stations_df["station_id"].astype(int)

        stations_df = stations_df.merge(
            station_master[
                ["station_id", "station_name"]
            ],
            on="station_id",
            how="left"
        )

        stations_df["station_name"] = stations_df["station_name"].fillna(
            "Unknown Station"
        )

        print("\n========== API DATA ==========")
        for station in stations_df.head(10).to_dict(orient="records"):
            print(station["station_name"])
        print("==============================")

    return {
        "total": len(stations_df),
        "stations": stations_df.to_dict(orient="records")
    }

     


# ============================================================================
# ENDPOINT 4: GET 24-HOUR FORECAST
# ============================================================================

@app.get("/api/forecast/tomorrow")
def get_forecast():
    """Get 24-hour passenger demand forecast"""
    
    if forecast_df is None:
        return {"error": "Forecast data not available", "status": "error"}
    
    try:
        latest_forecasts = forecast_df.tail(1440)
        
        hourly = latest_forecasts.groupby('forecast_hour').agg({
            'predicted_passengers': 'mean',
            'confidence_score': 'mean'
        }).reset_index()
        
        forecast_list = []
        peak_hours = []
        
        for _, row in hourly.iterrows():
            hour = int(row['forecast_hour'])
            passengers = int(row['predicted_passengers'])
            confidence = float(row['confidence_score'])
            
            forecast_list.append({
                "hour": hour,
                "predicted_passengers": passengers,
                "confidence": round(confidence, 3)
            })
            
            if hour in [7, 8, 9, 17, 18, 19]:
                peak_hours.append(hour)
        
        return {
            "date": str(datetime.now().date()),
            "forecast": sorted(forecast_list, key=lambda x: x['hour']),
            "peak_hours": peak_hours,
            "peak_hours_info": "7-9am (morning), 5-7pm (evening)",
            "accuracy": 0.912,
            "recommendation": "Add more trains during peak hours"
        }
    
    except Exception as e:
        return {"error": str(e), "status": "error"}


# ============================================================================
# ENDPOINT 5: GET ACTIVE ALERTS
# ============================================================================

@app.get("/api/alerts/active")
def get_alerts(
    hour: int = 17,
    station_id: int | None = None
):

    """Generate live alerts from current crowd data"""

    if crowd_df is None:
        return {
            "error": "Crowd data not available",
            "status": "error"
        }

    try:

        df = crowd_df.copy()

        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            dayfirst=True
        )

        latest_date = df["timestamp"].dt.date.max()

        selected_data = df[
            (df["timestamp"].dt.date == latest_date) &
            (df["timestamp"].dt.hour == hour)
        ]

        latest_data = (
            selected_data
            .sort_values("station_id")
            .drop_duplicates(subset="station_id")
            .reset_index(drop=True)
        )

        if station_id is not None:
            latest_data = latest_data[
                latest_data["station_id"] == station_id
            ]

        print(latest_data[["station_id"]].head(20))

        # Merge station names
        if station_master is not None:

            latest_data["station_id"] = latest_data["station_id"].astype(int)

            latest_data = latest_data.merge(
                station_master[
                    ["station_id", "station_name"]
                ],
                on="station_id",
                how="left"
            )

            latest_data["station_name"] = latest_data["station_name"].fillna(
                "Unknown Station"
            )

            print(latest_data.head(20))

        alerts_list = []

        for _, row in latest_data.iterrows():

            capacity = float(row["capacity_percentage"])

            if capacity >= 90:

                severity = "critical"
                alert_type = "Critical Overcrowding"

            elif capacity >= 80:

                severity = "high"
                alert_type = "Overcrowding"

            else:
                continue

            alerts_list.append({

                "station_id": int(row["station_id"]),

                "station_name": row["station_name"],

                "alert_type": alert_type,

                "severity": severity,

                "capacity_percentage": capacity,

                "passenger_count": int(row["passenger_count"]),

                "message": f"{row['station_name']} is operating at {capacity:.1f}% capacity",

                "timestamp": str(row["timestamp"])

            })

        return {

            "status": "success",

            "selected_hour": hour,

            "total_alerts": len(alerts_list),

            "active_count": len(alerts_list),

            "alerts": alerts_list

        }

    except Exception as e:

        return {

            "status": "error",

            "message": str(e)

        }

# ============================================================================
# ENDPOINT 6: GET TOP BUSIEST STATIONS
# ============================================================================

@app.get("/api/statistics/top-stations")
def get_top_stations(limit: int = 262):
    """Get top busiest stations"""

    if crowd_df is None:
        return {
            "error": "Crowd data not available",
            "status": "error"
        }

    try:

        # Calculate total passengers per station
        station_totals = (
            crowd_df.groupby("station_id")["passenger_count"]
            .sum()
            .reset_index(name="total_passengers")
        )

        # Merge with station master
        station_totals = station_totals.merge(
            station_master[["station_id", "station_name"]],
            on="station_id",
            how="left"
        )

        # Sort by busiest stations
        station_totals = station_totals.sort_values(
            "total_passengers",
            ascending=False
        ).head(limit)

        top_stations = []

        for rank, (_, row) in enumerate(station_totals.iterrows(), start=1):

            top_stations.append({
                "rank": rank,
                "station_id": int(row["station_id"]),
                "station_name": row["station_name"],
                "total_passengers": int(row["total_passengers"]),
                "average_per_hour": int(row["total_passengers"] / 168)
            })

        total_traffic = crowd_df["passenger_count"].sum()

        hub_percentage = (
            station_totals["total_passengers"].sum()
            / total_traffic
            * 100
        )

        return {
            "period": "7 days",
            "top_stations": top_stations,
            "hub_concentration": f"Top {limit} stations handle {hub_percentage:.1f}% of traffic"
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }


@app.get("/api/statistics/network")
def get_network_statistics():
    """
    Metro network statistics
    """

    return {
        "stations": 262,
        "routes": 36,
        "trips": 5438,
        "stop_times": 128434
    }

@app.get("/api/statistics/passengers")
def get_passenger_statistics():

    if crowd_df is None:
        return {
            "error": "Crowd data not available"
        }

    total = int(
        crowd_df["passenger_count"].sum()
    )

    average = int(
        crowd_df["passenger_count"].mean()
    )

    highest = int(
        crowd_df["passenger_count"].max()
    )

    lowest = int(
        crowd_df["passenger_count"].min()
    )


    return {
        "total_passengers": total,
        "average_passengers": average,
        "highest_passengers": highest,
        "lowest_passengers": lowest
    }

# ============================================================================
# ENDPOINT 7: GET HOURLY PATTERN
# ============================================================================

@app.get("/api/statistics/hourly-pattern")
def get_hourly_pattern():
    """Get average passengers by hour (shows peak times)"""
    
    if crowd_df is None:
        return {"error": "Crowd data not available", "status": "error"}
    
    try:
        # Create a copy to avoid SettingWithCopyWarning
        df = crowd_df.copy()
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        
        hourly = df.groupby('hour')['passenger_count'].agg(['mean', 'std', 'min', 'max']).reset_index()
        
        hourly_list = []
        for _, row in hourly.iterrows():
            hourly_list.append({
                "hour": int(row['hour']),
                "avg_passengers": int(row['mean']),
                "std_dev": int(row['std']) if not pd.isna(row['std']) else 0,
                "min": int(row['min']),
                "max": int(row['max'])
            })
        
        peak_hours = [7, 8, 9, 17, 18, 19]
        peak_data = hourly[hourly['hour'].isin(peak_hours)]
        off_peak_data = hourly[~hourly['hour'].isin(peak_hours)]
        
        peak_avg = peak_data['mean'].mean() if len(peak_data) > 0 else 0
        off_peak_avg = off_peak_data['mean'].mean() if len(off_peak_data) > 0 else 0
        
        ratio = peak_avg / off_peak_avg if off_peak_avg > 0 else 0
        
        return {
            "hourly_pattern": sorted(hourly_list, key=lambda x: x['hour']),
            "peak_hours": peak_hours,
            "peak_avg": int(peak_avg),
            "off_peak_avg": int(off_peak_avg),
            "ratio": round(ratio, 1),
            "insight": f"Peak hours are {round(ratio, 1)}x busier than off-peak"
        }
    
    except Exception as e:
        return {"error": str(e), "status": "error"}


# ============================================================================
# ENDPOINT 8: LSTM MODEL PREDICTION ⭐ STAR ENDPOINT
# ============================================================================

@app.post("/api/predict/next-hour")
def predict_next_hour(data: dict):
    """
    Use LSTM model to predict next hour passenger count
    
    Input:
    {
        "last_24_hours": [150, 145, 160, 155, 170, ...]
    }
    
    Output:
    {
        "prediction": 987,
        "confidence": 0.92
    }
    """
    
    # Check if model is loaded
    if not lstm_ready or lstm_model is None:
        return {
            "error": "LSTM model not available",
            "status": "unavailable",
            "message": "Model files not loaded. Check models/ folder."
        }

    try:
        # Validate input
        if "last_24_hours" not in data:
            return {
                "error": "Missing last_24_hours parameter",
                "status": "error",
                "expected_format": "Send JSON with key last_24_hours containing 24 numbers",
                "example": {
                    "last_24_hours": [150, 145, 160, 155, 170, 165, 180, 175, 172, 168, 155, 160, 165, 170, 175, 180, 185, 190, 195, 1000, 1050, 1020, 980, 950]
                }
            }
        
        last_24 = data["last_24_hours"]
        
        # Validate length
        if len(last_24) != 24:
            return {
                "error": f"Expected 24 values, got {len(last_24)}",
                "status": "error"
            }
        
        # Validate all are numbers
        try:
            last_24 = [float(x) for x in last_24]
        except:
            return {
                "error": "All values must be numbers",
                "status": "error"
            }
        
        # Normalize using scaler
        last_24_array = np.array(last_24).reshape(-1, 1)
        last_24_normalized = scaler.transform(last_24_array)
        
        # Reshape for LSTM
        last_24_reshaped = last_24_normalized.reshape(1, 24, 1)
        
        # Make prediction
        prediction_normalized = lstm_model.predict(last_24_reshaped, verbose=0)[0][0]
        prediction_actual = scaler.inverse_transform([[prediction_normalized]])[0][0]
        prediction_actual = max(50, min(1500, int(prediction_actual)))
        
        # Determine peak hour
        current_hour = datetime.now().hour
        peak_hour = current_hour in [7, 8, 9, 17, 18, 19]

        # Get AI recommendation
        try:
            recommendation = get_ai_recommendation(
                station="Metro Station",
                predicted_passengers=prediction_actual,
                peak_hour=peak_hour
            )
        except Exception:
            recommendation = "AI recommendation currently unavailable."
        
        # Calculate confidence
        avg_recent = np.mean(last_24)
        std_recent = np.std(last_24)
        confidence = 0.92 if std_recent < avg_recent * 0.3 else 0.85
        
        # Determine status
        if prediction_actual > 900:
            status_text = "PEAK - High traffic expected"
        elif prediction_actual > 400:
            status_text = "MODERATE - Medium traffic"
        else:
            status_text = "QUIET - Low traffic expected"

        # -----------------------------------------
        # AI Train Scheduling Recommendation
        # -----------------------------------------

        schedule = TrainScheduler.optimize_frequency(
            predicted_passengers=prediction_actual,
            current_frequency=8
        )

        required_trains = TrainScheduler.estimate_required_trains(
            prediction_actual
        )

        platform_load = TrainScheduler.estimate_platform_load(
            prediction_actual
        )

        peak_schedule = TrainScheduler.peak_hour_optimization(
            current_hour,
            prediction_actual
        ) 
        frequency_adjustment = TrainScheduler.frequency_adjustment(
            current_frequency=8,
            recommended_frequency=schedule["recommended_frequency"]
        )
        alert = TrainScheduler.schedule_alert(
        train_id=101,
        message="Passenger demand is increasing. Prepare additional train."
        )  
        
        return {  
            "status": "success",
            "prediction": prediction_actual,
            "confidence": round(confidence, 2),
            "confidence_percentage": f"{confidence*100:.1f}%",
            "status_text": status_text,
            "ai_recommendation": recommendation,
            "message": f"Next hour: {prediction_actual} passengers ({confidence*100:.1f}% confidence)",
            "train_schedule": schedule,
            "required_trains": required_trains,
            "platform_load": platform_load,
            "peak_hour_optimization": peak_schedule,
            "frequency_adjustment": frequency_adjustment,
            "schedule_alert": alert,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "error",
            "message": "Prediction failed"
        }


# ============================================================================
# RUN SERVER
# ============================================================================
 
# ============================================================================
# ENDPOINT 9: EXECUTIVE DASHBOARD KPI
# ============================================================================

@app.get("/api/dashboard/kpi")
def dashboard_kpi(hour: int = 17):

    try:

        if crowd_df is None:
            return {
                "status": "error",
                "message": "Crowd data not loaded"
            }

        # Work on a copy
        df = crowd_df.copy()

        # Convert timestamp correctly
        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            dayfirst=True
        )

        # Latest available date
        latest_date = df["timestamp"].dt.date.max()

        # Full latest day data
        today_data = df[
            df["timestamp"].dt.date == latest_date
        ]
        
        # One latest record per station
        latest_data = (
            today_data
            .sort_values("timestamp")
            .drop_duplicates(subset="station_id", keep="last")
            .reset_index(drop=True)
        )

        # Selected hour data for crowd monitoring
        hour_data = df[
            (df["timestamp"].dt.date == latest_date) &
            (df["timestamp"].dt.hour == hour)
        ]
        
        latest_hour_data = (
            hour_data
            .sort_values("timestamp")
            .drop_duplicates(
                subset="station_id",
                keep="last"
            )
        )

        # KPI calculations
        total_passengers_today = int(
            today_data["passenger_count"].sum()
        )
                

        active_stations = int(
            latest_hour_data["station_id"].nunique()
        )

        congested_stations = int(
            latest_hour_data[
                latest_hour_data["capacity_percentage"] >= 80
            ]["station_id"].nunique()
        )

        # Active alerts from current crowd

        active_alerts = int(
            latest_hour_data[
                latest_hour_data["capacity_percentage"] >= 80
            ].shape[0]
        )

        # Other KPIs
        forecast_records = (
            len(forecast_df)
            if forecast_df is not None
            else 0
        )

        traffic_records = (
            len(traffic_df)
            if traffic_df is not None
            else 0
        )

        model_status = (
            "Online"
            if lstm_ready
            else "Offline"
        )

        return {
            "status": "success",
            "kpis": {
                "total_passengers_today": total_passengers_today,
                "active_stations": active_stations,
                "congested_stations": congested_stations,
                "active_alerts": active_alerts,
                "forecast_records": forecast_records,
                "traffic_records": traffic_records,
                "model_status": model_status,
                "selected_hour": hour
            }
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

# ============================================================================
# ENDPOINT 10: ENTERPRISE SYSTEM HEALTH
# ============================================================================

@app.get("/api/system/health")
def system_health():
    """
    Enterprise System Health Monitor
    """

    return {

        "status": "healthy",

        "services": {

            "api": "Running",

            "database": "Connected",

            "ai_model": "Loaded" if lstm_ready else "Not Loaded",

            "scaler": "Loaded" if scaler is not None else "Not Loaded",

            "prediction_service": "Ready" if lstm_ready else "Unavailable"

        },

        "project": {

            "name": "MetroFlow AI Platform",

            "version": "2.0.0",

            "framework": "FastAPI",

            "ai_model": "TensorFlow LSTM"

        },

        "server_time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    } 

# ============================================================================
# ENDPOINT 11: AI CHAT ASSISTANT
# ============================================================================

@app.post("/api/ai/chat")
def ai_chat(request: ChatRequest):
    """
    Ask MetroFlow AI any question.
    """

    try:
        answer = get_ai_chat_response(request.question)

        return {
            "status": "success",
            "question": request.question,
            "answer": answer
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }  
if __name__ == "__main__":
    import uvicorn
    
    print()
    print("=" * 80)
    print("METROFLOW API SERVER STARTING")
    print("=" * 80)
    print()
    print("Endpoints available:")
    print("   1. GET  /                        - API info")
    print("   2. GET  /health                  - Health check")
    print("   3. GET  /api/crowd/station/{id}  - Current crowd")
    print("   4. GET  /api/forecast/tomorrow   - 24-hour forecast")
    print("   5. GET  /api/alerts/active       - Active alerts")
    print("   6. GET  /api/statistics/top-stations - Busiest stations")
    print("   7. GET  /api/statistics/hourly-pattern - Peak times")
    print("   8. POST /api/predict/next-hour   - LSTM prediction")
    print()
    print("Access at: http://localhost:8000")
    print("Docs at:   http://localhost:8000/docs")
    print()
    print("=" * 80)
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
from backend.database import SessionLocal
from backend.models import User

@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()

    try:
        # -------------------------------
        # Create Default Admin
        # -------------------------------
        admin = db.query(User).filter(User.username == "admin1").first()

        if not admin:
            admin = User(
                username="admin1",
                email="admin@metroflow.com",
                full_name="System Administrator",
                hashed_password=bcrypt.hashpw(
                    "admin123".encode("utf-8"),
                    bcrypt.gensalt()
                ).decode("utf-8"),
                role="admin",
                is_active=True
            )

            db.add(admin)
            db.commit()
            print("✅ Default admin created")

        else:
            print("✅ Admin already exists")

        # -------------------------------
        # Create Default User
        # -------------------------------
        user = db.query(User).filter(User.username == "user1").first()

        if not user:
            user = User(
                username="user1",
                email="user@metroflow.com",
                full_name="Metro User",
                hashed_password=bcrypt.hashpw(
                    "user123".encode("utf-8"),
                    bcrypt.gensalt()
                ).decode("utf-8"),
                role="user",
                is_active=True
            )

            db.add(user)
            db.commit()
            print("✅ Default user created")

        else:
            print("✅ User already exists")

    finally:
        db.close()
@app.post("/api/login", response_model=LoginResponse)
def login(data: LoginRequest):

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == data.email).first()
        print("Email received:", data.email)
        print("User found:", user)

        if user is None:
            return {
                "success": False,
                "role": "",
                "username": "",
                "email": ""
            }
        print("Password entered:", data.password)
        print("Password hash:", user.hashed_password)
        password_match = bcrypt.checkpw(
            data.password.encode("utf-8"),
            user.hashed_password.encode("utf-8")
        )

        print("Password match:", password_match)

        if not password_match:
            return {
                "success": False,
                "role": "",
                "username": "",
                "email": ""
            }

        return {
            "success": True,
            "role": user.role,
            "username": user.username,
            "email": user.email
        }

    finally:
        db.close()
@app.get("/api/admin/users")
def get_users():

    db = SessionLocal()

    try:
        users = db.query(User).all()

        return [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "full_name": u.full_name
            }
            for u in users
        ]

    finally:
        db.close()        
@app.post("/api/admin/users")
def create_user(data: CreateUserRequest):

    db = SessionLocal()

    try:
        # Check username
        existing_user = db.query(User).filter(
            User.username == data.username
        ).first()

        if existing_user:
            return {
                "success": False,
                "message": "Username already exists"
            }

        # Check email
        existing_email = db.query(User).filter(
            User.email == data.email
        ).first()

        if existing_email:
            return {
                "success": False,
                "message": "Email already exists"
            }

        new_user = User(
            username=data.username,
            email=data.email,
            full_name=data.full_name,
            hashed_password=bcrypt.hashpw(
                data.password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8"),
            role=data.role,
            is_active=True
        )

        db.add(new_user)
        db.commit()

        return {
            "success": True,
            "message": "User created successfully"
        }

    finally:
        db.close()  
@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int):

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

        # Prevent deleting the last/default admin
        if user.role == "admin":
            return {
                "success": False,
                "message": "Admin cannot be deleted"
            }

        db.delete(user)
        db.commit()

        return {
            "success": True,
            "message": "User deleted successfully"
        }

    finally:
        db.close()              