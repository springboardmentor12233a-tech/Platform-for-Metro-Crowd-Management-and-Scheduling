from datetime import time

from pydantic import BaseModel, ConfigDict


# ------------------------------------------------
# AI Schedule Recommendation Request
# ------------------------------------------------

class ScheduleRequest(BaseModel):
    predicted_passengers: float


# ------------------------------------------------
# AI Schedule Recommendation Response
# ------------------------------------------------

class ScheduleResponse(BaseModel):
    crowd_level: str
    train_frequency: str
    extra_trains: int
    platform_staff: int
    status: str
    recommendation: str


# ------------------------------------------------
# PostgreSQL Train Schedule Response
# ------------------------------------------------

class TrainScheduleResponse(BaseModel):
    id: int
    train_id: str
    line: str
    from_station: str
    to_station: str
    departure_time: time
    arrival_time: time
    platform: str
    status: str
    ai_suggestion: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )