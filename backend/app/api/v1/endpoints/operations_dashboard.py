from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.operations_dashboard import (
    OperationsDashboardResponse,
)

from app.services.operations_dashboard import (
    OperationsDashboardService,
)


router = APIRouter()


@router.get(
    "/",
    response_model=OperationsDashboardResponse,
)
def dashboard(
    db: Session = Depends(get_db),
):

    return OperationsDashboardService.dashboard(
        db=db,
    )