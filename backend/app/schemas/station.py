from pydantic import BaseModel


class StationCreate(BaseModel):
    station_name: str
    line: str
    distance_from_start: float
    opening_date: str
    station_layout: str
    latitude: float
    longitude: float
    capacity: int = 2000


class StationResponse(BaseModel):
    id: int
    station_name: str
    line: str
    distance_from_start: float
    opening_date: str
    station_layout: str
    latitude: float
    longitude: float
    capacity: int

    class Config:
        from_attributes = True