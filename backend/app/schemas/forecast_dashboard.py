from pydantic import BaseModel
from typing import List


class ForecastDay(BaseModel):
    day: str
    historical: int
    predicted: int
    predictedPassengers: int
    growthRate: float
    accuracy: float
    confidence: float


class HourlyDemand(BaseModel):
    hour: str
    demand: int


class RouteForecast(BaseModel):
    route: str
    current: int
    forecast: int
    growth: float
    capacity: int
    status: str


class ForecastDashboardResponse(BaseModel):
    forecastData: List[ForecastDay]
    hourlyDemand: List[HourlyDemand]
    routes: List[RouteForecast]