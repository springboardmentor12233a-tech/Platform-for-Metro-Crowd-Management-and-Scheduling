from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml.forecast_predict import predict_demand

router = APIRouter(
    prefix="/forecast",
    tags=["Passenger Demand Forecast"]
)


class ForecastRequest(BaseModel):
    station: str
    date: str


@router.post("/forecast-demand")
def forecast_demand(request: ForecastRequest):
    try:
        result = predict_demand(
            station=request.station,
            date=request.date
        )

        return {
            "status": "success",
            "station": request.station,
            "date": request.date,
            "predicted_passengers": result["predicted_passengers"],
            "demand_level": result["demand_level"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )