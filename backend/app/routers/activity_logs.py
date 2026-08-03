from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.activity_log_service import get_activity_logs
from app.core.role_checker import require_roles

router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"],
)


@router.get(
    "/",
    dependencies=[Depends(require_roles("Admin"))],
)
def read_activity_logs(db: Session = Depends(get_db)):
    return get_activity_logs(db)