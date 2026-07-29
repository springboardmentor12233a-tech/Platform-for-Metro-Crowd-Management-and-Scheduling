from sqlalchemy.orm import Session
import pandas as pd

from app.models import Station


class Mapper:
    def __init__(self, db: Session):
        self.db = db
        self.station_cache = {}

        # Load all existing stations into memory
        for station in db.query(Station).all():
            self.station_cache[station.station_name] = station.id

    def get_or_create_station(self, name: str):
        """
        Returns the Station.id corresponding to the station name.
        If the station does not exist, it is created.
        """

        if pd.isna(name) or not name:
            return None

        name = str(name).strip()

        # Already cached
        if name in self.station_cache:
            return self.station_cache[name]

        # Create new station
        station = Station(
            station_name=name
        )

        self.db.add(station)

        # Generate primary key without committing
        self.db.flush()

        self.station_cache[name] = station.id

        return station.id