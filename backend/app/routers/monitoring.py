from fastapi import APIRouter

from app.services.monitoring import get_dashboard

router = APIRouter(
    prefix="/monitoring",
    tags=["Real-Time Operational Monitoring"]
)


@router.get("/dashboard")
def dashboard():

    return get_dashboard()