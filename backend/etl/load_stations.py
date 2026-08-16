import time
import pandas as pd

from sqlalchemy import select

from app.models import Station

from etl.config import (
    GPS_CSV,
    CROWD_HISTORY_CSV,
    CROWD_PREDICTION_CSV,
    DELAY_CSV,
    OCCUPANCY_CSV,
    PASSENGER_CSV,
    SCHEDULES_CSV,
    SENSOR_CSV,
    TICKETING_CSV,
    TRAINS_CSV,
    TRIPS_CSV,
)


# ============================================================
# CLEAN STATION NAME
# ============================================================

def clean_station_name(value):
    """
    Clean and normalize station names.
    """

    if pd.isna(value):
        return None

    value = str(value).strip()

    if not value:
        return None

    return value


# ============================================================
# LOAD STATIONS
# ============================================================

def load_stations(db):

    start = time.time()

    stats = {
        "loaded": 0,
        "inserted": 0,
        "skipped": 0,
        "errors": 0,
        "time": 0,
    }

    print("Loading stations...")

    try:

        # =====================================================
        # 1. READ GPS DATASET
        # =====================================================

        gps_df = pd.read_csv(GPS_CSV)

        print(
            f"GPS records found: {len(gps_df)}"
        )

        # Dictionary:
        # station_name -> GPS/infrastructure information

        gps_stations = {}

        for _, row in gps_df.iterrows():

            station_name = clean_station_name(
                row.get("station_name")
            )

            if not station_name:
                continue

            key = station_name.lower()

            gps_stations[key] = {

                # IMPORTANT:
                # Keep GPS dataset ID
                "id": row.get("id"),

                "station_name": station_name,

                "distance_from_start_km": (
                    row.get(
                        "distance_from_start_km"
                    )
                ),

                "line": row.get("line"),

                "opening_date": (
                    row.get("opening_date")
                ),

                "station_layout": (
                    row.get("station_layout")
                ),

                "latitude": (
                    row.get("latitude")
                ),

                "longitude": (
                    row.get("longitude")
                ),

                "coord_invalid": (
                    row.get("coord_invalid")
                ),

                "distance_from_start_km_outlier": (
                    row.get(
                        "distance_from_start_km_outlier"
                    )
                ),

                "opening_year": (
                    row.get("opening_year")
                ),
            }


        # =====================================================
        # 2. COLLECT STATIONS FROM ALL DATASETS
        # =====================================================

        station_names = {}

        def add_station(value):

            station_name = clean_station_name(
                value
            )

            if not station_name:
                return

            key = station_name.lower()

            if key not in station_names:

                station_names[key] = station_name


        # -----------------------------------------------------
        # GPS
        # -----------------------------------------------------

        for station in gps_stations.values():

            add_station(
                station["station_name"]
            )


        # -----------------------------------------------------
        # Crowd History
        # -----------------------------------------------------

        df = pd.read_csv(
            CROWD_HISTORY_CSV,
            usecols=["station_name"],
        )

        for value in df["station_name"]:

            add_station(value)


        # -----------------------------------------------------
        # Crowd Prediction
        # -----------------------------------------------------

        df = pd.read_csv(
            CROWD_PREDICTION_CSV,
            usecols=["station_name"],
        )

        for value in df["station_name"]:

            add_station(value)


        # -----------------------------------------------------
        # Delay
        # -----------------------------------------------------

        df = pd.read_csv(
            DELAY_CSV,
            usecols=[
                "origin_station",
                "destination_station",
            ],
        )

        for value in df["origin_station"]:

            add_station(value)

        for value in df["destination_station"]:

            add_station(value)


        # -----------------------------------------------------
        # Occupancy
        # -----------------------------------------------------

        df = pd.read_csv(
            OCCUPANCY_CSV,
            usecols=["station_name"],
        )

        for value in df["station_name"]:

            add_station(value)


        # -----------------------------------------------------
        # Passenger Entry / Exit
        # -----------------------------------------------------

        df = pd.read_csv(
            PASSENGER_CSV,
            usecols=[
                "entry_station",
                "exit_station",
            ],
        )

        for value in df["entry_station"]:

            add_station(value)

        for value in df["exit_station"]:

            add_station(value)


        # -----------------------------------------------------
        # Schedules
        # -----------------------------------------------------

        df = pd.read_csv(
            SCHEDULES_CSV,
            usecols=["station_name"],
        )

        for value in df["station_name"]:

            add_station(value)


        # -----------------------------------------------------
        # Sensor Telemetry
        # -----------------------------------------------------

        df = pd.read_csv(
            SENSOR_CSV,
            usecols=["station_name"],
        )

        for value in df["station_name"]:

            add_station(value)


        # -----------------------------------------------------
        # Ticketing
        # -----------------------------------------------------

        df = pd.read_csv(
            TICKETING_CSV,
            usecols=[
                "from_station",
                "to_station",
            ],
        )

        for value in df["from_station"]:

            add_station(value)

        for value in df["to_station"]:

            add_station(value)


        # -----------------------------------------------------
        # Trains
        # -----------------------------------------------------

        df = pd.read_csv(
            TRAINS_CSV,
            usecols=["current_station"],
        )

        for value in df["current_station"]:

            add_station(value)


        # -----------------------------------------------------
        # Trips
        # -----------------------------------------------------

        df = pd.read_csv(
            TRIPS_CSV,
            usecols=[
                "origin_station",
                "destination_station",
            ],
        )

        for value in df["origin_station"]:

            add_station(value)

        for value in df["destination_station"]:

            add_station(value)


        # =====================================================
        # 3. GET EXISTING DATABASE STATIONS
        # =====================================================

        existing_stations = db.execute(
            select(Station)
        ).scalars().all()


        existing_names = {

            station.station_name.strip().lower():
            station

            for station in existing_stations

            if station.station_name
        }


        # =====================================================
        # 4. GET EXISTING DATABASE IDS
        # =====================================================

        existing_ids = {

            station.id

            for station in existing_stations

            if station.id is not None
        }


        # =====================================================
        # 5. DETERMINE NEXT AVAILABLE ID
        # =====================================================

        numeric_ids = [

            int(station_id)

            for station_id in existing_ids

            if isinstance(
                station_id,
                int
            )
        ]

        next_id = (
            max(numeric_ids, default=0) + 1
        )


        # =====================================================
        # 6. INSERT MISSING STATIONS
        # =====================================================

        inserted = 0

        skipped = 0


        for key, station_name in station_names.items():

            # -------------------------------------------------
            # Already exists
            # -------------------------------------------------

            if key in existing_names:

                skipped += 1

                continue


            # -------------------------------------------------
            # GPS information
            # -------------------------------------------------

            gps = gps_stations.get(key)


            # -------------------------------------------------
            # Determine station ID
            # -------------------------------------------------

            station_id = None


            if gps is not None:

                gps_id = gps.get("id")

                if pd.notna(gps_id):

                    try:

                        gps_id = int(gps_id)

                        # Use GPS ID only when available
                        # and not already used

                        if gps_id not in existing_ids:

                            station_id = gps_id

                    except (
                        ValueError,
                        TypeError
                    ):

                        station_id = None


            # -------------------------------------------------
            # Generate ID if GPS ID cannot be used
            # -------------------------------------------------

            if station_id is None:

                while next_id in existing_ids:

                    next_id += 1

                station_id = next_id

                next_id += 1


            # -------------------------------------------------
            # Create station
            # -------------------------------------------------

            station = Station(

                id=station_id,

                station_name=station_name,

                distance_from_start_km=(

                    gps.get(
                        "distance_from_start_km"
                    )

                    if gps

                    else None
                ),

                line=(

                    gps.get("line")

                    if gps

                    else None
                ),

                opening_date=(

                    gps.get("opening_date")

                    if gps

                    else None
                ),

                station_layout=(

                    gps.get(
                        "station_layout"
                    )

                    if gps

                    else None
                ),

                latitude=(

                    gps.get("latitude")

                    if gps

                    else None
                ),

                longitude=(

                    gps.get("longitude")

                    if gps

                    else None
                ),

                coord_invalid=(

                    gps.get(
                        "coord_invalid"
                    )

                    if gps

                    else None
                ),

                distance_from_start_km_outlier=(

                    gps.get(
                        "distance_from_start_km_outlier"
                    )

                    if gps

                    else None
                ),

                opening_year=(

                    gps.get(
                        "opening_year"
                    )

                    if gps

                    else None
                ),
            )


            db.add(station)


            # Keep track of the ID immediately
            existing_ids.add(station_id)


            # Keep track of the name
            existing_names[key] = station


            inserted += 1


        # =====================================================
        # 7. COMMIT
        # =====================================================

        db.commit()


        # =====================================================
        # 8. STATISTICS
        # =====================================================

        stats["loaded"] = len(
            station_names
        )

        stats["inserted"] = inserted

        stats["skipped"] = skipped


        print(
            f"Unique stations discovered: "
            f"{len(station_names)}"
        )

        print(
            f"New stations inserted: "
            f"{inserted}"
        )

        print(
            f"Existing stations skipped: "
            f"{skipped}"
        )


    except Exception as e:

        db.rollback()

        print(
            f"Station loading failed: {e}"
        )

        stats["errors"] = 1


    # =========================================================
    # 9. EXECUTION TIME
    # =========================================================

    stats["time"] = round(
        time.time() - start,
        2,
    )


    return stats