from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml.demand_predict import predict_demand

router = APIRouter(
    prefix="/forecast",
    tags=["Passenger Demand Forecast"]
)


class ForecastRequest(BaseModel):
    station: str
    day_type: str


@router.post("/forecast-demand")
def forecast_demand(request: ForecastRequest):
    try:
        result = predict_demand(
            station=request.station,
            day_type=request.day_type
        )

        return {
            "status": "success",
            "station": request.station,
            "day_type": request.day_type,
            "predicted_demand": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )