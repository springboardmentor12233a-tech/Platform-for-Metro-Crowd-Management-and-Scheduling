from pydantic import BaseModel
from datetime import datetime


class ReportCreate(BaseModel):
    report_type: str
    export_format: str


class ReportResponse(BaseModel):
    id: int

    report_type: str

    export_format: str

    network_status: str

    busiest_station: str

    summary: str

    recommendations: str

    operational_actions: str

    expected_impact: str

    confidence: float

    total_passengers: int

    total_revenue: float

    total_trips: int

    total_stations: int

    created_at: datetime

    class Config:
        from_attributes = True