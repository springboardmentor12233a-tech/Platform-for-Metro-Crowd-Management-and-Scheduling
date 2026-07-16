import pandas as pd
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic_crowd_demand.csv")

_df = pd.read_csv(DATA_PATH)
_df["Date"] = pd.to_datetime(_df["Date"])


def get_busiest_stations(top_n: int = 5):
    result = (
        _df.groupby("Station_Name")["Passengers"]
        .mean()
        .sort_values(ascending=False)
        .head(top_n)
        .round(1)
    )
    return [{"station": name, "avg_passengers": val} for name, val in result.items()]


def get_peak_hours():
    result = _df.groupby("Hour")["Passengers"].mean().round(1)
    peak_hour = int(result.idxmax())
    return {
        "hourly_average": [{"hour": int(h), "avg_passengers": v} for h, v in result.items()],
        "peak_hour": peak_hour,
        "peak_hour_avg_passengers": float(result.max()),
    }


def get_demand_by_line():
    result = _df.groupby("Line")["Passengers"].mean().sort_values(ascending=False).round(1)
    return [{"line": name, "avg_passengers": val} for name, val in result.items()]


def get_weekday_vs_weekend():
    result = _df.groupby("Is_Weekend")["Passengers"].mean().round(1)
    return {
        "weekday_avg_passengers": float(result.get(False, 0)),
        "weekend_avg_passengers": float(result.get(True, 0)),
    }


def get_traffic_summary(top_n: int = 5):
    return {
        "busiest_stations": get_busiest_stations(top_n),
        "peak_hours": get_peak_hours(),
        "demand_by_line": get_demand_by_line(),
        "weekday_vs_weekend": get_weekday_vs_weekend(),
        "total_records_analyzed": len(_df),
    }