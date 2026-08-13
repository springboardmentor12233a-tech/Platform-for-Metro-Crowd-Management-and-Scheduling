from pathlib import Path
from datetime import datetime, date
import json
import threading

import pandas as pd
import numpy as np
import joblib

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app import models


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed_station_demand.csv"
)

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "crowd_prediction_model.joblib"
)

META_PATH = (
    BASE_DIR
    / "models"
    / "model_metadata.json"
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/data",
    tags=["Dataset / Real-Time"]
)


# ============================================================
# LOAD DATA
# ============================================================

if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Processed dataset not found: {DATA_PATH}"
    )

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"ML model not found: {MODEL_PATH}"
    )

if not META_PATH.exists():
    raise FileNotFoundError(
        f"Model metadata not found: {META_PATH}"
    )


data = pd.read_csv(DATA_PATH)

data["Date"] = pd.to_datetime(
    data["Date"],
    errors="coerce"
)

data = data.dropna(
    subset=["Date", "station"]
)

data = data.sort_values(
    ["Date", "station"]
).reset_index(drop=True)


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)

metadata = json.loads(
    META_PATH.read_text(
        encoding="utf-8"
    )
)


# ============================================================
# REPLAY CONTROL
# ============================================================

_lock = threading.Lock()

cursor = 0


# ============================================================
# PREDICTION REQUEST
# ============================================================

class PredictionRequest(BaseModel):

    station: str

    target_date: date


# ============================================================
# HELPER
# ============================================================

def _row_to_dict(row):

    def clean(value):

        if pd.isna(value):
            return None

        if isinstance(
            value,
            np.integer
        ):
            return int(value)

        if isinstance(
            value,
            np.floating
        ):
            return float(value)

        if isinstance(
            value,
            pd.Timestamp
        ):
            return value.isoformat()

        return value

    return {
        key: clean(value)
        for key, value in row.items()
    }


# ============================================================
# STATUS
# ============================================================

@router.get("/status")
def status():

    with _lock:

        pos = cursor

        row = data.iloc[
            min(
                pos,
                len(data) - 1
            )
        ]

    return {

        "mode":
            "dataset_replay",

        "position":
            pos,

        "total_records":
            len(data),

        "current_date":
            str(
                row["Date"].date()
            ),

        "current_station":
            row["station"],

        "last_checked":
            datetime.now().isoformat()
    }


# ============================================================
# RESET REPLAY
# ============================================================

@router.post("/reset")
def reset():

    global cursor

    with _lock:

        cursor = 0

    return {

        "message":
            "Dataset replay reset",

        "position":
            0
    }


# ============================================================
# LIVE RECORD
# ============================================================

@router.get("/live")
def live():

    global cursor

    with _lock:

        row = data.iloc[
            cursor
        ].copy()

        cursor = (
            cursor + 1
        ) % len(data)

    return {

        "source":
            "delhi_metro_updated.csv",

        "mode":
            "dataset_replay",

        "timestamp":
            datetime.now().isoformat(),

        "record":
            _row_to_dict(row)
    }


# ============================================================
# SNAPSHOT
# ============================================================

@router.get("/snapshot")
def snapshot(
    limit: int = Query(
        20,
        ge=1,
        le=100
    )
):

    """
    Returns station records for the
    current replay date.
    """

    global cursor

    with _lock:

        current_date = data.iloc[
            cursor
        ]["Date"]

        cursor = (
            cursor + 1
        ) % len(data)

    rows = data[
        data["Date"].eq(
            current_date
        )
    ].head(limit)

    return {

        "source":
            "delhi_metro_updated.csv",

        "mode":
            "dataset_replay",

        "timestamp":
            datetime.now().isoformat(),

        "date":
            str(
                current_date.date()
            ),

        "count":
            len(rows),

        "records": [
            _row_to_dict(row)
            for _, row in rows.iterrows()
        ]
    }


# ============================================================
# DASHBOARD
# ============================================================

@router.get("/dashboard")
def dashboard():

    with _lock:

        current_date = data.iloc[
            cursor
        ]["Date"]

    rows = data[
        data["Date"].eq(
            current_date
        )
    ]

    return {

        "date":
            str(
                current_date.date()
            ),

        "total_stations":
            int(
                rows["station"].nunique()
            ),

        "high_demand":
            int(
                (
                    rows["crowd_level"]
                    == "High"
                ).sum()
            ),

        "medium_demand":
            int(
                (
                    rows["crowd_level"]
                    == "Medium"
                ).sum()
            ),

        "low_demand":
            int(
                (
                    rows["crowd_level"]
                    == "Low"
                ).sum()
            ),

        "total_passengers":
            float(
                rows[
                    "passenger_demand"
                ].sum()
            )
    }


# ============================================================
# HEATMAP
# ============================================================

@router.get("/heatmap")
def heatmap():

    with _lock:

        current_date = data.iloc[
            cursor
        ]["Date"]

    rows = data[
        data["Date"].eq(
            current_date
        )
    ].copy()

    rows = rows.dropna(
        subset=[
            "latitude",
            "longitude"
        ]
    )

    records = []

    for _, row in rows.iterrows():

        records.append({

            "station":
                row["station"],

            "line":
                row["line"],

            "latitude":
                float(
                    row["latitude"]
                ),

            "longitude":
                float(
                    row["longitude"]
                ),

            "passenger_demand":
                float(
                    row["passenger_demand"]
                ),

            "crowd_level":
                row["crowd_level"]
        })

    return {

        "date":
            str(
                current_date.date()
            ),

        "records":
            records
    }


# ============================================================
# STATIONS
# ============================================================

@router.get("/stations")
def stations():

    station_list = sorted(
        data[
            "station"
        ]
        .dropna()
        .unique()
        .tolist()
    )

    return {

        "stations":
            station_list
    }


# ============================================================
# ML PREDICTION
# ============================================================

@router.post("/predict")
def predict(
    payload: PredictionRequest,
    db: Session = Depends(get_db)
):
    station = payload.station.strip()

    if not station:
        raise HTTPException(
            status_code=400,
            detail="Station is required"
        )

    # Prepare input for the trained passenger-demand model
    X = pd.DataFrame([{
        "station": station,
        "day_of_week": payload.target_date.weekday(),
        "day": payload.target_date.day,
        "month": payload.target_date.month,
        "year": payload.target_date.year,
        "is_weekend": int(payload.target_date.weekday() >= 5)
    }])

    # Predict passenger demand
    try:
        predicted = float(max(0, model.predict(X)[0]))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    # Check station in processed dataset
    hist = data[
        data["station"].str.lower().eq(station.lower())
    ]

    if hist.empty:
        raise HTTPException(
            status_code=404,
            detail="Station not found in passenger dataset"
        )

    # Historical demand thresholds
    median = float(hist["median_demand"].iloc[0])
    p80 = float(hist["p80_demand"].iloc[0])
    p90 = float(hist["p90_demand"].iloc[0])

    # Determine crowd level
    if predicted > p80:
        level = "High"
    elif predicted >= median:
        level = "Medium"
    else:
        level = "Low"

    # Save prediction into Prediction History
    try:
        history = models.PredictionHistory(
            station_name=station,
            passenger_count=round(predicted, 2),
            predicted_crowd=level,
            prediction_type="Crowd Prediction",
            predicted_by="System"
        )

        db.add(history)
        db.commit()
        db.refresh(history)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save prediction history: {str(e)}"
        )

    return {
        "station": station,
        "target_date": str(payload.target_date),
        "predicted_passengers": round(predicted, 2),
        "crowd_level": level,
        "historical_median": round(median, 2),
        "historical_p80": round(p80, 2),
        "historical_p90_capacity_proxy": round(p90, 2),
        "model": "RandomForestRegressor",
        "note": "p90 is a historical demand proxy, not physical station capacity."
    }
    # --------------------------------------------------------
    # Find station using case-insensitive matching
    # --------------------------------------------------------

    station_matches = data[
        data["station"]
        .astype(str)
        .str.lower()
        .eq(
            station.lower()
        )
    ]


    if station_matches.empty:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Station '{station}' "
                "not found in processed dataset"
            )
        )


    # Use canonical station name
    canonical_station = (
        station_matches["station"]
        .iloc[0]
    )


    # --------------------------------------------------------
    # Create prediction features
    # --------------------------------------------------------

    X = pd.DataFrame([
        {

            "station":
                canonical_station,

            "day_of_week":
                payload.target_date.weekday(),

            "day":
                payload.target_date.day,

            "month":
                payload.target_date.month,

            "year":
                payload.target_date.year,

            "is_weekend":
                int(
                    payload.target_date.weekday()
                    >= 5
                )
        }
    ])


    # --------------------------------------------------------
    # Predict passenger demand
    # --------------------------------------------------------

    predicted = float(
        model.predict(X)[0]
    )

    predicted = max(
        0,
        predicted
    )


    # --------------------------------------------------------
    # Historical station thresholds
    # --------------------------------------------------------

    hist = data[
        data["station"]
        == canonical_station
    ]


    median = float(
        hist[
            "median_demand"
        ].iloc[0]
    )

    p80 = float(
        hist[
            "p80_demand"
        ].iloc[0]
    )

    p90 = float(
        hist[
            "p90_demand"
        ].iloc[0]
    )


    # --------------------------------------------------------
    # Determine crowd level
    # --------------------------------------------------------

    if predicted > p80:

        level = "High"

    elif predicted >= median:

        level = "Medium"

    else:

        level = "Low"


    # --------------------------------------------------------
    # Return prediction
    # --------------------------------------------------------

    return {

        "station":
            canonical_station,

        "target_date":
            str(
                payload.target_date
            ),

        "predicted_passengers":
            round(
                predicted,
                2
            ),

        "crowd_level":
            level,

        "historical_median":
            round(
                median,
                2
            ),

        "historical_p80":
            round(
                p80,
                2
            ),

        "historical_p90_capacity_proxy":
            round(
                p90,
                2
            ),

        "model":
            metadata.get(
                "model",
                "RandomForestRegressor"
            ),

        "note":
            (
                "p90 is a historical demand "
                "proxy, not physical station capacity."
            )
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@router.get("/model-info")
def model_info():

    return metadata