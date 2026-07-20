from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.frequency import recommend_frequency

router = APIRouter(
    prefix="/frequency",
    tags=["Dynamic Frequency Adjustment"]
)


class FrequencyRequest(BaseModel):
    demand_level: str


@router.post("/recommend")
def frequency(request: FrequencyRequest):

    result = recommend_frequency(request.demand_level)

    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )

    return {
        "demand_level": request.demand_level,
        **result
    }