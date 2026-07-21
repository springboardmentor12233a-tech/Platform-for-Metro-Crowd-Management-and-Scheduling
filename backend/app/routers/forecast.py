from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles

from app.schemas.forecast import (
    ForecastRequest,
    ForecastResponse,
)

from app.forecasting.forecast_service import predict_forecast

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"],
)


@router.post(
    "/predict",
    response_model=ForecastResponse,
)
def forecast(
    request: ForecastRequest,
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
            "Analyst",
        )
    ),
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