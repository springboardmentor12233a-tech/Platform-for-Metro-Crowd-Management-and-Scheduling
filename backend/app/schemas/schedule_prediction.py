from pydantic import BaseModel


class SchedulePredictionRequest(BaseModel):

    train_id: str

    origin_station: str

    destination_station: str

    scheduled_departure: str

    trip_date: str

    distance_km: float


class SchedulePredictionResponse(BaseModel):

    train_id: str

    origin_station: str

    destination_station: str

    scheduled_departure: str

    trip_date: str

    distance_km: float

    predicted_duration_min: int

    predicted_arrival: str

    predicted_speed_kmh: float