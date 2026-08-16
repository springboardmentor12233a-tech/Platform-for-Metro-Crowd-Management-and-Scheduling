from pydantic import BaseModel, Field


class FrequencyAdjustmentRequest(BaseModel):

    station_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Metro station name"
    )

    current_frequency: int = Field(
        ...,
        gt=0,
        description="Current train interval in minutes"
    )


class FrequencyAdjustmentResponse(BaseModel):

    frequency_action: str

    action_code: int

    occupancy: int

    capacity: int

    occupancy_percentage: float

    current_frequency: int

    recommended_frequency: int

    additional_trains_required: int

    recommendation: str

    reason: str

    priority: str

    action_required: bool

    estimated_wait_time_impact: str