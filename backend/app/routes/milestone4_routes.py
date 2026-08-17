from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.services.milestone4_service import (
    get_deployment_readiness_report,
    get_final_demo_report,
    get_testing_validation_report,
)

router = APIRouter(prefix="/milestone4", tags=["Milestone 4 - Testing Deployment Documentation"])


@router.get("/testing-report")
def testing_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_testing_validation_report(db)


@router.get("/deployment-readiness")
def deployment_readiness(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_deployment_readiness_report(db)


@router.get("/final-demo-report")
def final_demo_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_final_demo_report(db)


@router.get("/report")
def milestone4_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_final_demo_report(db)
