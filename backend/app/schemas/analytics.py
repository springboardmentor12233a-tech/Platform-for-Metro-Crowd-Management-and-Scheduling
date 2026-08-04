from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel


class AnalyticsSummaryResponse(BaseModel):
    total_stations: int
    total_routes: int
    total_trains: int
    active_trains: int
    delayed_trains: int
    total_passengers: int
    congested_stations_count: int
    peak_station: str
    peak_hour: str
    
    total_predictions: int
    average_predicted_crowd: float
    maximum_predicted_crowd: int
    minimum_predicted_crowd: int
    high_alerts: int
    critical_alerts: int
    most_common_crowd_level: str
    last_prediction_time: Optional[datetime]
    
    latest_alerts: List[Any] = []
    latest_predictions: List[Any] = []
    
    ai_model: str
    prediction_accuracy: float

    class Config:
        from_attributes = True