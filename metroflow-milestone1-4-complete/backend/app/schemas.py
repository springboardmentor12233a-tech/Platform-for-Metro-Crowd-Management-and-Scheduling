from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    assigned_station: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class StationOut(BaseModel):
    id: int
    name: str
    line: Optional[str] = None
    capacity: int

    class Config:
        from_attributes = True


class SummaryCard(BaseModel):
    label: str
    value: str
    helper: str


class ChartPoint(BaseModel):
    label: str
    value: float


class DashboardSummary(BaseModel):
    total_passengers: int
    total_trips: int
    total_stations: int
    busiest_station: str
    latest_date: Optional[date]
    average_fare: float
    cards: List[SummaryCard]
    remarks_split: List[ChartPoint]
    ticket_type_split: List[ChartPoint]


class StationCrowd(BaseModel):
    station_id: int
    station_name: str
    capacity: int
    inbound_passengers: int
    outbound_passengers: int
    current_load: int
    crowd_percentage: float
    congestion_status: str


class PassengerTrendPoint(BaseModel):
    date: date
    passengers: int


class HeatmapPoint(BaseModel):
    station_name: str
    load: int
    crowd_percentage: float
    congestion_status: str


class TrainScheduleOut(BaseModel):
    id: int
    train_number: str
    line: str
    source_station: str
    destination_station: str
    departure_time: str
    arrival_time: str
    frequency_minutes: int
    recommended_frequency: int
    expected_load: int
    delay_minutes: int
    status: str

    class Config:
        from_attributes = True


class ScheduleUpdateRequest(BaseModel):
    delay_minutes: int
    status: str


class FrequencyRecommendation(BaseModel):
    station_name: str
    line: str
    current_load: int
    crowd_percentage: float
    current_frequency: int
    recommended_frequency: int
    recommendation: str


class OperationalMetric(BaseModel):
    label: str
    value: str
    helper: str


class OperationalMonitoring(BaseModel):
    active_trains: int
    delayed_trains: int
    average_delay_minutes: float
    high_risk_stations: int
    metrics: List[OperationalMetric]


class DemandForecastPoint(BaseModel):
    forecast_date: date
    predicted_passengers: int
    demand_level: str
    confidence: float


class StationPrediction(BaseModel):
    station_name: str
    predicted_load: int
    risk_level: str
    recommendation: str


class TrafficReport(BaseModel):
    total_passengers: int
    peak_context: str
    busiest_station: str
    report_points: List[ChartPoint]
    insights: List[str]


class PredictionResponse(BaseModel):
    forecast: List[DemandForecastPoint]
    station_predictions: List[StationPrediction]
    model_name: str
    model_note: str


class AlertOut(BaseModel):
    id: int
    title: str
    station_name: Optional[str] = None
    severity: str
    category: str
    message: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AnnouncementCreate(BaseModel):
    title: str
    message: str
    target_station: Optional[str] = None
    priority: str = "Normal"


class AnnouncementOut(BaseModel):
    id: int
    title: str
    message: str
    target_station: Optional[str] = None
    priority: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class OperationalUpdateOut(BaseModel):
    id: int
    update_type: str
    line: Optional[str] = None
    station_name: Optional[str] = None
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsReport(BaseModel):
    station_count: int
    active_alerts: int
    delayed_trains: int
    predicted_peak_passengers: int
    congestion_heatmap: List[HeatmapPoint]
    operational_insights: List[str]
    station_performance: List[ChartPoint]
