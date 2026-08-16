from typing import Optional

from pydantic import BaseModel


class RidershipPredictionRequest(BaseModel):

    # Optional — not used by the ML model
    station_name: Optional[str] = None

    # ML input features
    hour: int
    day: int
    month: int
    day_of_week: int
    weekend: int


class RidershipPredictionResponse(BaseModel):

    station_name: Optional[str] = None

    predicted_entry_count: int

    predicted_exit_count: int