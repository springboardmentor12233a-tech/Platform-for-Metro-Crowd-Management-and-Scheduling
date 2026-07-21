from datetime import date
from pydantic import BaseModel


class ForecastRequest(BaseModel):
    station: str
    forecast_date: date


class ForecastResponse(BaseModel):
    station: str
    forecast_date: date
    predicted_passengers: float