from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles

from app.schemas.schedule import (
    ScheduleRequest,
    ScheduleResponse,
)

from app.services.scheduling_service import generate_schedule

router = APIRouter(
    prefix="/schedule",
    tags=["Smart Scheduling"],
)


@router.post(
    "/recommend",
    response_model=ScheduleResponse,
)
def recommend_schedule(
    request: ScheduleRequest,
    current_user=Depends(
        require_roles(
            "Admin",
            "Operator",
        )
    ),
):
    return generate_schedule(
        request.predicted_passengers
    )