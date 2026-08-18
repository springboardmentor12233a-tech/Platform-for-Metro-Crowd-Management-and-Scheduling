from fastapi import APIRouter
import pandas as pd
from pathlib import Path

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

try:
    stations_df = pd.read_csv(DATA_DIR / "station_master.csv")
    routes_df = pd.read_csv(DATA_DIR / "Route_master.csv")
    trips_df = pd.read_csv(DATA_DIR / "Trip_master.csv")
    stop_times_df = pd.read_csv(DATA_DIR / "StopTime_master.csv")
    crowd_df = pd.read_csv(DATA_DIR / "StationCrowdData.csv")

except Exception as e:
    print(e)

    stations_df = pd.DataFrame()
    routes_df = pd.DataFrame()
    trips_df = pd.DataFrame()
    stop_times_df = pd.DataFrame()
    crowd_df = pd.DataFrame()

# -----------------------------
# Rename columns
# -----------------------------

if not routes_df.empty:
    routes_df = routes_df.rename(columns={
        "Route_ID": "route_id",
        "Rout_Code": "route_code",
        "Route_Name": "route_name",
        "Route_Type": "route_type",
    })

if not trips_df.empty:
    trips_df = trips_df.rename(columns={
        "Trip_ID": "trip_id",
        "Route_ID": "route_id",
        "Service_ID": "service_id",
        "Shape_ID": "shape_id",
    })

if not stations_df.empty:
    stations_df = stations_df.rename(columns={
        "Station_ID": "stop_id",
        "Station_Name": "station_name",
        "Latitude": "latitude",
        "Longitude": "longitude",
    })

# -----------------------------
# Get latest crowd information
# -----------------------------

latest_crowd = {}

if not crowd_df.empty:

    crowd_df["timestamp"] = pd.to_datetime(
        crowd_df["timestamp"],
        dayfirst=True
    )

    latest_rows = (
        crowd_df
        .sort_values("timestamp")
        .groupby("station_id")
        .tail(1)
    )

    latest_crowd = latest_rows.set_index("station_id").to_dict("index")


@router.get("/network")
def get_metro_network(hour: int | None = None):

    # Select crowd data based on requested hour
    selected_crowd = crowd_df

    if hour is not None and not crowd_df.empty:
        selected_crowd = crowd_df[
            crowd_df["timestamp"].dt.hour == hour
        ]

    # Get the latest record for each station
    selected_latest_crowd = {}

    if not selected_crowd.empty:
        latest_rows = (
            selected_crowd
            .sort_values("timestamp")
            .groupby("station_id")
            .tail(1)
        )

        selected_latest_crowd = (
            latest_rows
            .set_index("station_id")
            .to_dict("index")
        )

    total_stations = len(stations_df)
    total_lines = len(routes_df)

    routes = []

    processed_routes = set()

    # Loop through every route
    for _, route in routes_df.iterrows():

        route_name = route["route_name"]
        line_name = route_name.split("_")[0]

        if line_name in processed_routes:
            continue

        processed_routes.add(line_name)

        stations = []

        # Get all trips for this route
        route_trips = trips_df[
            trips_df["route_id"] == route["route_id"]
        ]

        if not route_trips.empty:

            # Use first trip
            trip_id = route_trips.iloc[0]["trip_id"]

            # Get stops
            stops = stop_times_df[
                stop_times_df["trip_id"] == trip_id
            ].sort_values("stop_sequence")

            print(
                route["route_name"],
                trip_id,
                len(stops)
            )

            for _, stop in stops.iterrows():

                station = stations_df[
                    stations_df["stop_id"] == stop["stop_id"]
                ]

                if not station.empty:

                    station_id = int(station.iloc[0]["stop_id"])

                    crowd = selected_latest_crowd.get(station_id, {})

                    stations.append({
                        "station_id": station_id,
                        "station_name": station.iloc[0]["station_name"],
                        "latitude": station.iloc[0]["latitude"],
                        "longitude": station.iloc[0]["longitude"],
                        "sequence": int(stop["stop_sequence"]),
                    
                        "crowd_level": crowd.get("crowd_level", 1),
                        "current_passengers": crowd.get("passenger_count", 0),
                        "capacity_percentage": crowd.get("capacity_percentage", 0),
                    
                        "status": (
                            "critical"
                            if crowd.get("crowd_level", 1) >= 4
                            else "crowded"
                            if crowd.get("crowd_level", 1) == 3
                            else "normal"
                        ),
                })

            print(
                route["route_name"],
                "Stations:",
                len(stations),
                "Unique:",
                len(set((s["latitude"], s["longitude"]) for s in stations))
            )

        routes.append({
            "route_id": int(route["route_id"]),
            "route_name": route["route_name"],
            "route_code": route["route_code"],
            "route_type": route["route_type"],
            "stations": stations
        })

    return {
        "total_stations": total_stations,
        "metro_lines": total_lines,
        "operational": "100%",
        "interchange": 24,
        "routes": routes
    }