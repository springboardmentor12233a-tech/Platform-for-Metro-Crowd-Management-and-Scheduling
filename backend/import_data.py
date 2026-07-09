import pandas as pd
from database import engine

# --- Load Stations ---
stations = pd.read_csv("data/station_master.csv")
stations = stations.rename(columns={
    "Station_ID": "station_id",
    "Station_Name": "name",
    "Latitude": "latitude",
    "Longitude": "longitude"
})
stations = stations[["station_id", "name", "latitude", "longitude"]]
stations.to_sql("stations", engine, if_exists="append", index=False)
print(f"Imported {len(stations)} stations")

# --- Load Routes ---
routes = pd.read_csv("data/Route_master.csv")
routes = routes.rename(columns={
    "Route_ID": "route_id",
    "Rout_Code": "route_code",
    "Route_Name": "route_name",
    "Route_Type": "route_type",
    "Route_Color": "route_color"
})
routes = routes[["route_id", "route_code", "route_name", "route_type", "route_color"]]
routes.to_sql("routes", engine, if_exists="append", index=False)
print(f"Imported {len(routes)} routes")

# --- Load Trips ---
trips = pd.read_csv("data/Trip_master.csv")
trips = trips.rename(columns={
    "Trip_ID": "trip_id",
    "Route_ID": "route_id",
    "Service_ID": "service_id",
    "Shape_ID": "shape_id"
})
trips = trips[["trip_id", "route_id", "service_id", "shape_id"]]
trips.to_sql("trips", engine, if_exists="append", index=False)
print(f"Imported {len(trips)} trips")

# --- Load StopTimes ---
stop_times = pd.read_csv("data/StopTime_master.csv")
stop_times = stop_times[["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"]]
stop_times.to_sql("stop_times", engine, if_exists="append", index=False)
print(f"Imported {len(stop_times)} stop times")

print("All data imported successfully!")