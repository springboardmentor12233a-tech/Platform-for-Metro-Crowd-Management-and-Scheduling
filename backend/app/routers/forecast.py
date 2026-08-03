from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database import get_db

from app.schemas.forecast import (
    ForecastRequest,
    ForecastResponse,
)
from app.schemas.forecast_dashboard import (
    ForecastDashboardResponse,
)

from app.forecasting.forecast_service import predict_forecast
from app.services.forecast_dashboard_service import (
    get_forecast_dashboard,
)

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"],
    dependencies=[
        Depends(require_roles("Admin", "Operator", "Analyst"))
    ],
)


@router.post(
    "/predict",
    response_model=ForecastResponse,
)
def forecast(
    request: ForecastRequest,
):

    prediction = predict_forecast(
        request.station,
        request.forecast_date,
    )

    return ForecastResponse(
        station=request.station,
        forecast_date=request.forecast_date,
        predicted_passengers=prediction,
    )


@router.get(
    "/dashboard",
    response_model=ForecastDashboardResponse,
)
def forecast_dashboard(
    db: Session = Depends(get_db),
):
    return get_forecast_dashboard(db)