from fastapi import APIRouter, Depends

from app.auth.permissions import require_roles
from app.schemas.schedule import (
    ScheduleRequest,
    ScheduleResponse,
)

from app.services.scheduling_service import generate_schedule

router = APIRouter(
    prefix="/schedule",
    tags=["Smart Scheduling"],
    dependencies=[
        Depends(
            require_roles(
                "Admin",
                "Operator",
            )
        )
    ],
)


@router.post(
    "/recommend",
    response_model=ScheduleResponse,
)
def recommend_schedule(
    request: ScheduleRequest,
):
    return generate_schedule(
        request.predicted_passengers
    )