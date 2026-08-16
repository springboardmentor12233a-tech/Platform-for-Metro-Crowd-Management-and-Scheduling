from pydantic import BaseModel


class ScheduleRecommendationRequest(BaseModel):

    station_name: str

    hour: int

    day: int

    month: int

    weekend: bool


class ScheduleRecommendationResponse(BaseModel):

    station_name: str

    train_id: str

    arrival_time: str

    departure_time: str

    platform: int

    status: str

    predicted_entries: int

    predicted_exits: int

    crowd_level: str

    current_frequency: int

    recommended_frequency: int

    recommended_action: str

    reason: str