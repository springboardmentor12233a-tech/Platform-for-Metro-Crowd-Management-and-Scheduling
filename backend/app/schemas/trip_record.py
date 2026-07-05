from pydantic import BaseModel


class TripRecordResponse(BaseModel):
    id: int
    trip_id: int
    trip_date: str
    from_station: str
    to_station: str
    distance_km: float
    fare: float
    cost_per_passenger: float
    passengers: int
    ticket_type: str
    remarks: str

    class Config:
        from_attributes = True