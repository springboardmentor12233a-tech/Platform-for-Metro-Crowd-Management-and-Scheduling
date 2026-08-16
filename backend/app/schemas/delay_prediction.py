from pydantic import BaseModel, Field


class DelayPredictionRequest(BaseModel):

    transport_type: str = "Metro"

    route_id: str = "Route_1"

    origin_station: str | None = None

    destination_station: str | None = None

    scheduled_departure_min: int = Field(
        ...,
        ge=0,
        le=1439,
    )

    scheduled_arrival_min: int = Field(
        ...,
        ge=0,
        le=1439,
    )

    travel_duration: float = Field(
        ...,
        ge=0,
    )

    departure_hour: int = Field(
        ...,
        ge=0,
        le=23,
    )

    weather_condition: str = "Clear"

    temperature_c: float = 25.0

    humidity_percent: float = Field(
        60.0,
        ge=0,
        le=100,
    )

    wind_speed_kmh: float = Field(
        10.0,
        ge=0,
    )

    precipitation_mm: float = Field(
        0.0,
        ge=0,
    )

    weather_severity: float = 0.0

    event_type: str = "Unknown"

    event_attendance_est: float = 0.0

    event_severity: float = 0.0

    event_impact: float = 0.0

    traffic_congestion_index: float = Field(
        50.0,
        ge=0,
        le=100,
    )

    traffic_severity: float = 0.0

    traffic_weather_score: float = 0.0

    rush_hour_score: float = 0.0

    holiday: int = Field(
        0,
        ge=0,
        le=1,
    )

    peak_hour: int = Field(
        0,
        ge=0,
        le=1,
    )

    weekday: int = Field(
        0,
        ge=0,
        le=6,
    )

    season: str = "Summer"

    month: int = Field(
        ...,
        ge=1,
        le=12,
    )

    day_of_week: int = Field(
        ...,
        ge=0,
        le=6,
    )

    is_weekend: int = Field(
        0,
        ge=0,
        le=1,
    )

    is_extreme_weather: int = Field(
        0,
        ge=0,
        le=1,
    )


class DelayPredictionResponse(BaseModel):

    prediction_id: str

    predicted_delay_minutes: float

    delay_level: str

    confidence_score: float | None = None

    recommendation: str

    reason: str