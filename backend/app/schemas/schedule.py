from pydantic import BaseModel


class ScheduleRequest(BaseModel):
    predicted_passengers: float


class ScheduleResponse(BaseModel):
    crowd_level: str
    train_frequency: str
    extra_trains: int
    platform_staff: int
    status: str
    recommendation: str