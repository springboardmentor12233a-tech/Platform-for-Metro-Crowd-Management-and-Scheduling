from pydantic import BaseModel


class PassengerPredictionRequest(BaseModel):
    from_station: str
    to_station: str
    distance_km: float
    fare: float
    cost_per_passenger: float
    ticket_type: str
    remarks: str


class PassengerPredictionResponse(BaseModel):
    predicted_passengers: int