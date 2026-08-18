from fastapi import APIRouter
from fastapi.responses import FileResponse
import json
import pandas as pd
from pathlib import Path
from ml.predict import predict_crowd

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUTS = BASE_DIR / "outputs"
METRO_DATA = BASE_DIR / "datasets" / "metro_data"


def load_json(filename):
    with open(OUTPUTS / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def load_csv(filename):
    return pd.read_csv(OUTPUTS / filename)
def load_metro_schedule():
    return pd.read_csv(BASE_DIR / "datasets" / "metro_schedule" / "metro_schedule.csv").fillna("")
def load_metro_csv():
    return pd.read_csv(METRO_DATA / "delhi_metro_data.csv")


@router.get("/dashboard")
def dashboard():
    metro = load_metro_csv()
    trains = load_json("trains_cleaned.json")
    schedule = load_metro_schedule()

    # Calculate line-wise station distribution
    line_distribution = (
        metro.groupby("Line")["Station"]
        .count()
        .reset_index()
        .rename(columns={
            "Line": "line",
            "Station": "stations"
        })
    )

    line_distribution = line_distribution.to_dict(orient="records")

    # Find busiest line
    busiest = max(
        line_distribution,
        key=lambda x: x["stations"]
    )

    return {
        "total_stations": len(metro),
        "total_trains": len(trains),
        "passengers_today": len(schedule),
        "prediction": "Moderate",

        "busiest_line": busiest["line"],
        "busiest_line_stations": busiest["stations"],

        "recommendation":
            "AI recommends monitoring passenger flow during peak hours.",

        "ai_confidence": 92,

        # NEW
        "line_distribution": line_distribution
    }

@router.get("/stations")
def get_stations():
    return load_json("stations_cleaned.json")


@router.get("/trains")
def get_trains():
    return load_json("trains_cleaned.json")


@router.get("/schedules")
def get_schedules():
    return load_json("schedules_cleaned.json")

@router.get("/metro-stations")
def get_metro_stations():
    metro = load_metro_csv()

    # Replace NaN values with empty strings
    metro = metro.fillna("")

    return metro.to_dict(orient="records")
@router.get("/metro-schedule")
def get_metro_schedule():
    metro_schedule = load_metro_schedule()
    return metro_schedule.to_dict(orient="records")

@router.get("/metro-lines")
def get_metro_lines():
    metro = load_metro_csv()

    line_summary = (
        metro.groupby("Line")["Station"]
        .count()
        .reset_index()
        .rename(columns={"Station": "Total_Stations"})
    )

    return line_summary.to_dict(orient="records")

@router.get("/route-details")

def get_route_details(from_station: str, to_station: str):

    metro = load_metro_csv()

    from_station = from_station.strip()
    to_station = to_station.strip()

    # Find From station
    from_data = metro[
        metro["Station"].astype(str).str.strip() == from_station
    ]

    # Find To station
    to_data = metro[
        metro["Station"].astype(str).str.strip() == to_station
    ]

    if from_data.empty or to_data.empty:
        return {
            "detail": "One or both stations not found."
        }

    # Get coordinates
    from_lat = float(from_data.iloc[0]["Latitude"])
    from_lon = float(from_data.iloc[0]["Longitude"])

    to_lat = float(to_data.iloc[0]["Latitude"])
    to_lon = float(to_data.iloc[0]["Longitude"])

    # Calculate approximate distance
    from math import radians, sin, cos, sqrt, atan2

    R = 6371

    lat1 = radians(from_lat)
    lat2 = radians(to_lat)

    dlat = radians(to_lat - from_lat)
    dlon = radians(to_lon - from_lon)

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    # Approximate fare
    fare = round(10 + distance * 2, 2)

    # Approximate cost per passenger
    cost_per_passenger = round(distance * 1.5, 2)

    # Approximate travel time
    travel_minutes = round(distance * 3)

    return {
        "From_Station": from_station,
        "To_Station": to_station,
        "Distance_km": round(distance, 2),
        "Fare": fare,
        "Cost_per_passenger": cost_per_passenger,
        "travel_time": f"{travel_minutes} minutes"
    }
from fastapi import Body

@router.post("/predict-crowd")
def predict(data: dict = Body(...)):
    prediction = predict_crowd(data)

    return {
        "predicted_passengers": round(prediction, 2)
    }

# ==========================
# Download CSV
# ==========================

@router.get("/download/csv")
def download_csv():
    file_path = OUTPUTS / "delhi_metro_cleaned.csv"

    return FileResponse(
        path=file_path,
        filename="Delhi_Metro_Data.csv",
        media_type="text/csv"
    )


# ==========================
# Download Excel
# ==========================

@router.get("/download/excel")
def download_excel():

    csv_path = OUTPUTS / "delhi_metro_cleaned.csv"

    excel_path = OUTPUTS / "Delhi_Metro_Data.xlsx"

    df = pd.read_csv(csv_path)

    df.to_excel(excel_path, index=False)

    return FileResponse(
        path=excel_path,
        filename="Delhi_Metro_Data.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    
@router.get("/dashboard/charts")
def dashboard_charts():

    metro = load_metro_csv()

    line_data = (
        metro.groupby("Line")["Station"]
        .count()
        .reset_index()
        .rename(columns={
            "Line": "line",
            "Station": "stations"
        })
    )

    return {
        "line_distribution": line_data.to_dict(orient="records")
    }