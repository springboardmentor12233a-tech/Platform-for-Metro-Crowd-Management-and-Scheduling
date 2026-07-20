from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.scheduler import recommend_schedule

router = APIRouter(
    prefix="/schedule",
    tags=["Train Scheduling"]
)


class ScheduleRequest(BaseModel):

    source: str
    destination: str


@router.post("/recommend")
def schedule(request: ScheduleRequest):

    result = recommend_schedule(
        request.source,
        request.destination
    )

    if "error" in result:
        raise HTTPException(
            status_code=404,
            detail=result["error"]
        )

    return result