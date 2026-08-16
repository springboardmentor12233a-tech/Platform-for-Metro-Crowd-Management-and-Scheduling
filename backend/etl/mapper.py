from sqlalchemy.orm import Session

from app.models.station import Station


class Mapper:

    def __init__(self, db: Session):
        self.db = db
        self.station_cache = {}

        # Load existing stations
        self._refresh_station_cache()

    # ============================================================
    # REFRESH CACHE
    # ============================================================

    def _refresh_station_cache(self):

        self.station_cache.clear()

        stations = (
            self.db.query(Station)
            .all()
        )

        for station in stations:

            if station.station_name:

                name = station.station_name.strip()

                self.station_cache[name] = station.id

    # ============================================================
    # GET STATION ID
    # ============================================================

    def get_station_id(self, station_name):

        if not station_name:
            return None

        station_name = str(
            station_name
        ).strip()

        if not station_name:
            return None

        # Check cache
        station_id = self.station_cache.get(
            station_name
        )

        if station_id is not None:
            return station_id

        # Check database
        station = (
            self.db.query(Station)
            .filter(
                Station.station_name == station_name
            )
            .first()
        )

        if station:

            self.station_cache[
                station_name
            ] = station.id

            return station.id

        return None

    # ============================================================
    # GET OR CREATE STATION
    # ============================================================

    def get_or_create_station(self, station_name):

        if not station_name:
            return None

        station_name = str(
            station_name
        ).strip()

        if not station_name:
            return None

        # --------------------------------------------------------
        # Check cache
        # --------------------------------------------------------

        station_id = self.station_cache.get(
            station_name
        )

        if station_id is not None:
            return station_id

        # --------------------------------------------------------
        # Check database
        # --------------------------------------------------------

        station = (
            self.db.query(Station)
            .filter(
                Station.station_name == station_name
            )
            .first()
        )

        if station:

            self.station_cache[
                station_name
            ] = station.id

            return station.id

        # --------------------------------------------------------
        # Create new station
        # --------------------------------------------------------

        station = Station(
            station_name=station_name
        )

        self.db.add(station)

        # PostgreSQL generates the ID
        self.db.flush()

        station_id = station.id

        print(
            f"Created missing station: "
            f"{station_name} -> ID {station_id}"
        )

        # Cache the ID
        self.station_cache[
            station_name
        ] = station_id

        return station_id