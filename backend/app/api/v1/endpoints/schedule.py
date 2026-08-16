from fastapi import APIRouter, Query, HTTPException

from app.services.schedule_csv import ScheduleCSVService


router = APIRouter()


@router.get("/")
def get_all_schedules(
    skip: int = Query(
        0,
        ge=0,
    ),
    limit: int = Query(
        100,
        ge=1,
        le=500,
    ),
):

    try:

        return ScheduleCSVService.get_all_schedules(
            skip=skip,
            limit=limit,
        )

    except FileNotFoundError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load schedules: {str(e)}",
        )