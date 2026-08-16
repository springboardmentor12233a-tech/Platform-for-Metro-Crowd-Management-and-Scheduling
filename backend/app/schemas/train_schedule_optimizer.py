from pydantic import BaseModel, Field


class TrainScheduleOptimizationRequest(BaseModel):

    station_name: str

    hour: int = Field(
        ...,
        ge=0,
        le=23,
    )

    day: int = Field(
        ...,
        ge=1,
        le=31,
    )

    month: int = Field(
        ...,
        ge=1,
        le=12,
    )

    weekend: bool


class TrainScheduleOptimizationResponse(BaseModel):

    station_name: str

    train_id: str

    current_platform: int

    recommended_platform: int

    schedule_action: str

    action_code: int

    current_departure_time: str

    recommended_departure_time: str

    predicted_passengers: int

    crowd_level: str

    current_frequency: int

    recommended_frequency: int

    train_to_allocate: str

    delay_minutes: int

    reschedule_required: bool

    recommendation: str

    reason: str