from pathlib import Path
from datetime import datetime

import pandas as pd

from app.schemas.train_location import (
    TrainLocationResponse,
    TrainLocationListResponse,
)


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]


GPS_FILE = (
    BASE_DIR
    / "datasets"
    / "gps_preprocessed.csv"
)


SENSOR_FILE = (
    BASE_DIR
    / "datasets"
    / "sensor_preprocessed.csv"
)


SCHEDULE_FILE = (
    BASE_DIR
    / "datasets"
    / "schedules_preprocessed.csv"
)


# ============================================================
# Load datasets
# ============================================================

GPS = pd.read_csv(GPS_FILE)

SENSOR = pd.read_csv(SENSOR_FILE)

SCHEDULE = pd.read_csv(SCHEDULE_FILE)


# ============================================================
# Clean GPS data
# ============================================================

GPS["station_name"] = (
    GPS["station_name"]
    .astype(str)
    .str.strip()
)

GPS["line"] = (
    GPS["line"]
    .astype(str)
    .str.strip()
)

GPS["latitude"] = pd.to_numeric(
    GPS["latitude"],
    errors="coerce",
)

GPS["longitude"] = pd.to_numeric(
    GPS["longitude"],
    errors="coerce",
)


# Remove invalid coordinates

GPS = GPS[
    GPS["latitude"].notna()
    & GPS["longitude"].notna()
].copy()


# ============================================================
# Clean sensor data
# ============================================================

SENSOR["station_name"] = (
    SENSOR["station_name"]
    .astype(str)
    .str.strip()
)

SENSOR["timestamp"] = pd.to_datetime(
    SENSOR["timestamp"],
    errors="coerce",
)

SENSOR = SENSOR[
    SENSOR["timestamp"].notna()
].copy()


# ============================================================
# Clean schedule data
# ============================================================

SCHEDULE["station_name"] = (
    SCHEDULE["station_name"]
    .astype(str)
    .str.strip()
)

SCHEDULE["train_id"] = (
    SCHEDULE["train_id"]
    .astype(str)
    .str.strip()
)

SCHEDULE["arrival_time"] = (
    SCHEDULE["arrival_time"]
    .astype(str)
    .str.strip()
)

SCHEDULE["departure_time"] = (
    SCHEDULE["departure_time"]
    .astype(str)
    .str.strip()
)


# ============================================================
# Helper Functions
# ============================================================

def time_to_minutes(value):

    try:

        parts = str(value).split(":")

        hours = int(parts[0])
        minutes = int(parts[1])

        return hours * 60 + minutes

    except Exception:

        return None


def get_day_type():

    today = datetime.now()

    weekday = today.weekday()

    if weekday >= 5:

        return "Weekend"

    return "Weekday"


def get_current_minutes():

    now = datetime.now()

    return (
        now.hour * 60
        + now.minute
        + now.second / 60
    )


def get_sensor_for_station(
    station_name,
):

    station_sensor = SENSOR[
        SENSOR["station_name"].str.lower()
        == station_name.lower()
    ]

    if station_sensor.empty:

        return None

    return (
        station_sensor
        .sort_values(
            "timestamp",
            ascending=False,
        )
        .iloc[0]
    )


def get_station_gps(
    station_name,
):

    station = GPS[
        GPS["station_name"].str.lower()
        == station_name.lower()
    ]

    if station.empty:

        return None

    return station.iloc[0]


# ============================================================
# Find Train Position
# ============================================================

def find_train_position(
    train_schedule,
    current_minutes,
):

    train_schedule = train_schedule.copy()

    train_schedule["arrival_min"] = (
        train_schedule["arrival_time"]
        .apply(time_to_minutes)
    )

    train_schedule["departure_min"] = (
        train_schedule["departure_time"]
        .apply(time_to_minutes)
    )

    train_schedule = train_schedule.dropna(
        subset=[
            "arrival_min",
            "departure_min",
        ]
    )

    train_schedule = train_schedule.sort_values(
        "arrival_min"
    )

    if train_schedule.empty:

        return None


    # --------------------------------------------------------
    # Case 1: Train is currently at a station
    # --------------------------------------------------------

    for index, row in train_schedule.iterrows():

        arrival = row["arrival_min"]

        departure = row["departure_min"]

        if (
            arrival
            <= current_minutes
            <= departure
        ):

            return {
                "type": "station",
                "station": row["station_name"],
                "next_station": None,
                "arrival": arrival,
                "departure": departure,
            }


    # --------------------------------------------------------
    # Case 2: Train is between two stations
    # --------------------------------------------------------

    rows = list(
        train_schedule.iterrows()
    )

    for i in range(
        len(rows) - 1
    ):

        _, current = rows[i]

        _, next_row = rows[i + 1]

        departure = current["departure_min"]

        next_arrival = next_row["arrival_min"]

        if (
            departure
            < current_minutes
            < next_arrival
        ):

            return {
                "type": "between",
                "station": current["station_name"],
                "next_station": next_row[
                    "station_name"
                ],
                "departure": departure,
                "arrival": next_arrival,
            }


    # --------------------------------------------------------
    # Before first station
    # --------------------------------------------------------

    first = train_schedule.iloc[0]

    if current_minutes < first["arrival_min"]:

        return {
            "type": "not_started",
            "station": first["station_name"],
            "next_station": None,
        }


    # --------------------------------------------------------
    # After last station
    # --------------------------------------------------------

    last = train_schedule.iloc[-1]

    if current_minutes > last["departure_min"]:

        return {
            "type": "completed",
            "station": last["station_name"],
            "next_station": None,
        }


    return None


# ============================================================
# Main Service
# ============================================================

class TrainLocationService:

    @staticmethod
    def get_train_locations():

        current_minutes = get_current_minutes()

        day_type = get_day_type()

        results = []

        train_ids = (
            SCHEDULE["train_id"]
            .dropna()
            .unique()
        )


        for train_id in train_ids:

            train_schedule = SCHEDULE[
                SCHEDULE["train_id"]
                == train_id
            ].copy()


            # ------------------------------------------------
            # Prefer current day type
            # ------------------------------------------------

            if "day_type" in train_schedule.columns:

                filtered = train_schedule[
                    train_schedule["day_type"]
                    .astype(str)
                    .str.lower()
                    == day_type.lower()
                ]

                if not filtered.empty:

                    train_schedule = filtered


            position = find_train_position(
                train_schedule,
                current_minutes,
            )


            if position is None:

                continue


            station_name = position[
                "station"
            ]

            next_station = position.get(
                "next_station"
            )


            # ------------------------------------------------
            # Completed
            # ------------------------------------------------

            if position["type"] == "completed":

                gps = get_station_gps(
                    station_name
                )

                results.append(
                    TrainLocationResponse(

                        train_id=str(
                            train_id
                        ),

                        line=(
                            str(
                                gps["line"]
                            )
                            if gps is not None
                            else None
                        ),

                        current_station=station_name,

                        next_station=None,

                        latitude=(
                            float(
                                gps["latitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        longitude=(
                            float(
                                gps["longitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        speed_kmh=0,

                        status="Completed",

                        location_source=(
                            "Schedule + Station GPS"
                        ),

                        sensor_available=False,

                    )
                )

                continue


            # ------------------------------------------------
            # Not started
            # ------------------------------------------------

            if position["type"] == "not_started":

                gps = get_station_gps(
                    station_name
                )

                results.append(
                    TrainLocationResponse(

                        train_id=str(
                            train_id
                        ),

                        line=(
                            str(
                                gps["line"]
                            )
                            if gps is not None
                            else None
                        ),

                        current_station=station_name,

                        next_station=None,

                        latitude=(
                            float(
                                gps["latitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        longitude=(
                            float(
                                gps["longitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        speed_kmh=0,

                        status="Not Started",

                        location_source=(
                            "Schedule + Station GPS"
                        ),

                        sensor_available=False,

                    )
                )

                continue


            # ------------------------------------------------
            # Train is at station
            # ------------------------------------------------

            if position["type"] == "station":

                gps = get_station_gps(
                    station_name
                )

                sensor = get_sensor_for_station(
                    station_name
                )


                results.append(
                    TrainLocationResponse(

                        train_id=str(
                            train_id
                        ),

                        line=(
                            str(
                                gps["line"]
                            )
                            if gps is not None
                            else None
                        ),

                        current_station=station_name,

                        next_station=None,

                        latitude=(
                            float(
                                gps["latitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        longitude=(
                            float(
                                gps["longitude"]
                            )
                            if gps is not None
                            else None
                        ),

                        speed_kmh=0,

                        status="At Station",

                        location_source=(
                            "Schedule + Station GPS"
                        ),

                        sensor_available=(
                            sensor is not None
                        ),

                        platform_crowd=(
                            int(
                                sensor[
                                    "platform_crowd"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        temperature=(
                            float(
                                sensor[
                                    "temperature"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        humidity=(
                            float(
                                sensor[
                                    "humidity"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        co2_ppm=(
                            int(
                                sensor[
                                    "co2_ppm"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        pm25=(
                            int(
                                sensor[
                                    "pm25"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        escalator_status=(
                            str(
                                sensor[
                                    "escalator_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        lift_status=(
                            str(
                                sensor[
                                    "lift_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        camera_status=(
                            str(
                                sensor[
                                    "camera_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        timestamp=(
                            str(
                                sensor[
                                    "timestamp"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                    )
                )

                continue


            # ------------------------------------------------
            # Train between stations
            # ------------------------------------------------

            if position["type"] == "between":

                current_gps = get_station_gps(
                    station_name
                )

                next_gps = get_station_gps(
                    next_station
                )

                sensor = get_sensor_for_station(
                    station_name
                )


                if (
                    current_gps is not None
                    and next_gps is not None
                ):

                    departure = position[
                        "departure"
                    ]

                    arrival = position[
                        "arrival"
                    ]

                    progress = (
                        current_minutes
                        - departure
                    ) / (
                        arrival
                        - departure
                    )

                    progress = max(
                        0,
                        min(
                            1,
                            progress,
                        )
                    )


                    latitude = (
                        float(
                            current_gps[
                                "latitude"
                            ]
                        )
                        + progress
                        * (
                            float(
                                next_gps[
                                    "latitude"
                                ]
                            )
                            - float(
                                current_gps[
                                    "latitude"
                                ]
                            )
                        )
                    )


                    longitude = (
                        float(
                            current_gps[
                                "longitude"
                            ]
                        )
                        + progress
                        * (
                            float(
                                next_gps[
                                    "longitude"
                                ]
                            )
                            - float(
                                current_gps[
                                    "longitude"
                                ]
                            )
                        )
                    )

                else:

                    latitude = (
                        float(
                            current_gps[
                                "latitude"
                            ]
                        )
                        if current_gps is not None
                        else None
                    )

                    longitude = (
                        float(
                            current_gps[
                                "longitude"
                            ]
                        )
                        if current_gps is not None
                        else None
                    )


                # Approximate speed

                distance = 1.0

                if (
                    current_gps is not None
                    and next_gps is not None
                ):

                    distance = abs(
                        float(
                            next_gps[
                                "distance_from_start_km"
                            ]
                        )
                        - float(
                            current_gps[
                                "distance_from_start_km"
                            ]
                        )
                    )


                travel_minutes = (
                    position["arrival"]
                    - position["departure"]
                )


                if travel_minutes > 0:

                    speed = (
                        distance
                        / (
                            travel_minutes
                            / 60
                        )
                    )

                else:

                    speed = 0


                results.append(
                    TrainLocationResponse(

                        train_id=str(
                            train_id
                        ),

                        line=(
                            str(
                                current_gps[
                                    "line"
                                ]
                            )
                            if current_gps is not None
                            else None
                        ),

                        current_station=station_name,

                        next_station=next_station,

                        latitude=latitude,

                        longitude=longitude,

                        speed_kmh=round(
                            speed,
                            2,
                        ),

                        status="Running",

                        location_source=(
                            "Schedule + "
                            "Interpolated Station GPS"
                        ),

                        sensor_available=(
                            sensor is not None
                        ),

                        platform_crowd=(
                            int(
                                sensor[
                                    "platform_crowd"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        temperature=(
                            float(
                                sensor[
                                    "temperature"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        humidity=(
                            float(
                                sensor[
                                    "humidity"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        co2_ppm=(
                            int(
                                sensor[
                                    "co2_ppm"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        pm25=(
                            int(
                                sensor[
                                    "pm25"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        escalator_status=(
                            str(
                                sensor[
                                    "escalator_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        lift_status=(
                            str(
                                sensor[
                                    "lift_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        camera_status=(
                            str(
                                sensor[
                                    "camera_status"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                        timestamp=(
                            str(
                                sensor[
                                    "timestamp"
                                ]
                            )
                            if sensor is not None
                            else None
                        ),

                    )
                )


        return TrainLocationListResponse(

            trains=results,

            total_trains=len(results),

        )