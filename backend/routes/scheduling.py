from fastapi import APIRouter

from backend.schemas import (
    FrequencyAdjustmentRequest,
    OptimizationResponse
)
from backend.scheduling import TrainScheduler

router = APIRouter(
    prefix="/api/scheduling",
    tags=["Train Scheduling"]
)


@router.post(
    "/optimize-frequency",
    response_model=OptimizationResponse
)
def optimize_frequency(request: FrequencyAdjustmentRequest):
    """
    Optimize train frequency based on predicted passengers.
    """

    result = TrainScheduler.optimize_frequency(
        request.predicted_passengers,
        request.current_frequency
    )

    return result


@router.get("/platform-load/{passengers}")
def platform_load(passengers: int):
    """
    Estimate platform crowd level.
    """

    return {
        "passengers": passengers,
        "platform_load":
            TrainScheduler.estimate_platform_load(passengers)
    }


@router.get("/required-trains/{passengers}")
def required_trains(passengers: int):
    """
    Estimate required trains.
    """

    return {
        "predicted_passengers": passengers,
        "required_trains":
            TrainScheduler.estimate_required_trains(passengers)
    }

@router.get("/peak-hour/{hour}/{predicted_passengers}")
def peak_hour(hour: int, predicted_passengers: int):

    return TrainScheduler.peak_hour_optimization(
        hour,
        predicted_passengers
    )
@router.get("/generate-schedule")
def generate_schedule(
    start_hour: int,
    end_hour: int,
    frequency: int
):
    return {
        "schedule": TrainScheduler.generate_schedule(
            start_hour,
            end_hour,
            frequency
        )
    }
@router.get("/delay/{delay_minutes}")
def delay_management(delay_minutes: int):

    return TrainScheduler.handle_delay(delay_minutes)
@router.get("/platform-allocation/{passengers}")
def platform_allocation(passengers: int):

    return TrainScheduler.allocate_platform(passengers)
@router.get("/alert/{train_id}")
def send_alert(train_id: int, message: str):

    return TrainScheduler.schedule_alert(
        train_id,
        message
    )
    