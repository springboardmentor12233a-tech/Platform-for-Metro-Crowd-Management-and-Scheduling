from pydantic import BaseModel


class RidershipPredictionRequest(BaseModel):

    station_name: str

    platform_count: int

    concourse_count: int

    hour: int

    day: int

    month: int

    day_of_week: int

    weekend: int


class RidershipPredictionResponse(BaseModel):

    predicted_entry_count: int

    predicted_exit_count: int