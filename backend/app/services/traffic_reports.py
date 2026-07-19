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

def get_congestion_heatmap(top_n_stations: int = 12):
    """
    Returns a station x hour grid of average passenger demand,
    limited to the busiest N stations for readability.
    """
    busiest = (
        _df.groupby("Station_Name")["Passengers"]
        .mean()
        .sort_values(ascending=False)
        .head(top_n_stations)
        .index.tolist()
    )

    subset = _df[_df["Station_Name"].isin(busiest)]

    pivot = (
        subset.groupby(["Station_Name", "Hour"])["Passengers"]
        .mean()
        .round(1)
        .reset_index()
    )

    stations = sorted(busiest, key=lambda s: -subset[subset["Station_Name"] == s]["Passengers"].mean())
    hours = sorted(_df["Hour"].unique().tolist())

    grid = []
    for station in stations:
        row = {"station": station, "values": []}
        for hour in hours:
            match = pivot[(pivot["Station_Name"] == station) & (pivot["Hour"] == hour)]
            value = float(match["Passengers"].iloc[0]) if not match.empty else 0
            row["values"].append({"hour": int(hour), "passengers": value})
        grid.append(row)

    return {"stations": stations, "hours": hours, "grid": grid}

def get_ai_insights(top_n_stations: int = 5):
    """
    Generates plain-English operational insights and recommendations
    by analyzing the demand data: overloaded stations, peak windows,
    and weekday/weekend imbalance.
    """
    insights = []

    station_max = _df.groupby("Station_Name")["Passengers"].max()
    critical_stations = station_max[station_max >= 1400].sort_values(ascending=False)

    for station, max_val in critical_stations.head(top_n_stations).items():
        station_hourly = _df[_df["Station_Name"] == station].groupby("Hour")["Passengers"].mean()
        peak_hours = station_hourly[station_hourly >= 1400].index.tolist()
        if peak_hours:
            hour_ranges = f"{min(peak_hours)}:00\u2013{max(peak_hours)}:00"
            insights.append({
                "type": "capacity_warning",
                "station": station,
                "message": f"{station} consistently exceeds critical crowd levels during {hour_ranges}. "
                           f"Consider increasing train frequency or adding extra coaches during this window."
            })

    hourly_avg = _df.groupby("Hour")["Passengers"].mean()
    peak_hour = int(hourly_avg.idxmax())
    off_peak_hour = int(hourly_avg.idxmin())
    insights.append({
        "type": "scheduling_recommendation",
        "station": None,
        "message": f"Network-wide demand peaks around {peak_hour}:00. Scheduling additional trains "
                   f"in the hour leading up to {peak_hour}:00 could reduce platform crowding before it builds up. "
                   f"Demand is lowest around {off_peak_hour}:00, where frequency could be safely reduced to save resources."
    })

    weekday_avg = _df[_df["Is_Weekend"] == False]["Passengers"].mean()
    weekend_avg = _df[_df["Is_Weekend"] == True]["Passengers"].mean()
    if weekday_avg > weekend_avg * 1.3:
        pct_diff = round((weekday_avg / weekend_avg - 1) * 100, 1)
        insights.append({
            "type": "resource_allocation",
            "station": None,
            "message": f"Weekday demand runs about {pct_diff}% higher than weekends. "
                       f"Weekend schedules could safely run at reduced frequency to optimize train and staff allocation."
        })

    line_avg = _df.groupby("Line")["Passengers"].mean().sort_values(ascending=False)
    if len(line_avg) > 1:
        busiest_line = line_avg.index[0]
        quietest_line = line_avg.index[-1]
        insights.append({
            "type": "line_balance",
            "station": None,
            "message": f"{busiest_line} carries the highest average demand of all lines, while {quietest_line} "
                       f"carries the lowest. Resource and rolling-stock allocation could be reviewed to match this imbalance."
        })

    return {"insights": insights, "generated_from_records": len(_df)}