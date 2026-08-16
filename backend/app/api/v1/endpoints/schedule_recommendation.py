from fastapi import APIRouter

from app.schemas.schedule_recommendation import (
    ScheduleRecommendationRequest,
    ScheduleRecommendationResponse,
)

from app.services.schedule_recommendation import (
    ScheduleRecommendationService,
)

router = APIRouter()


@router.post(
    "/recommend",
    response_model=ScheduleRecommendationResponse,
)
def recommend_schedule(
    request: ScheduleRecommendationRequest,
):
    return ScheduleRecommendationService.recommend(request)