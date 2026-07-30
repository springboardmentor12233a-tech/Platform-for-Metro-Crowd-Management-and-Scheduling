from fastapi import APIRouter
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
    return {
    "total_stations": len(metro),
    "total_trains": len(trains),
    "passengers_today": len(schedule),
    "prediction": "Moderate"
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