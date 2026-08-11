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
@router.get("/delay")
def delay_management(
    start_hour: int,
    end_hour: int,
    frequency: int,
    delay_minutes: int
):
    schedule = TrainScheduler.generate_schedule(
        start_hour,
        end_hour,
        frequency
    )

    return TrainScheduler.handle_delay(
        schedule,
        delay_minutes
    )
@router.get("/platform-allocation/{passengers}")
def platform_allocation(passengers: int):

    return TrainScheduler.allocate_platform(passengers)
@router.get("/alert/{train_id}")
def send_alert(train_id: int, message: str):

    return TrainScheduler.schedule_alert(
        train_id,
        message
    )

@router.get("/dashboard")
def scheduling_dashboard(hour: int = 12):
    """
    Scheduling dashboard data
    """

    # Sample predicted passengers
    # Simulate passenger demand based on selected hour

    if 7 <= hour <= 10:
        predicted_passengers = 1800
    
    elif 17 <= hour <= 20:
        predicted_passengers = 2000
    
    elif 11 <= hour <= 16:
        predicted_passengers = 1200
    
    elif 5 <= hour <= 6:
        predicted_passengers = 700
    
    elif 21 <= hour <= 23:
        predicted_passengers = 600
    
    else:
        predicted_passengers = 350

    current_frequency = 5

    optimization = TrainScheduler.optimize_frequency(
        predicted_passengers,
        current_frequency
    )

    required_trains = TrainScheduler.estimate_required_trains(
        predicted_passengers
    )

    platform_load = TrainScheduler.estimate_platform_load(
        predicted_passengers
    )

    peak = TrainScheduler.peak_hour_optimization(
        hour,
        predicted_passengers
    )

    schedule = TrainScheduler.generate_schedule(
        hour,
        hour + 1,
        optimization["recommended_frequency"]
    )

    return {
        "predicted_passengers": predicted_passengers,
        "current_frequency": current_frequency,
        "recommended_frequency": optimization["recommended_frequency"],
        "required_trains": required_trains,
        "platform_load": platform_load,
        "peak_hour": peak,
        "schedule": schedule
    }
    