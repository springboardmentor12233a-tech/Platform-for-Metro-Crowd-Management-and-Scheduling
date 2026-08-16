from typing import List

from pydantic import BaseModel


class CriticalStation(BaseModel):
    station_name: str
    crowd_level: str
    predicted_delay: int
    recommendation: str


class OperationsDashboardResponse(BaseModel):

    total_trains: int

    running_trains: int

    idle_trains: int

    maintenance_trains: int

    delayed_trains: int

    average_delay: float

    high_crowd_stations: int

    critical_stations: List[CriticalStation]