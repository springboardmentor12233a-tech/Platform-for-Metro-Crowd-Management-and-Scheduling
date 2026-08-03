from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def create_activity_log(
    db: Session,
    *,
    user_id: int,
    user_name: str,
    role: str,
    action: str,
    module: str,
    target: str | None = None,
    status: str = "Success",
    ip_address: str | None = None,
):
    activity = ActivityLog(
        user_id=user_id,
        user_name=user_name,
        role=role,
        action=action,
        module=module,
        target=target,
        status=status,
        ip_address=ip_address,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


def get_activity_logs(db: Session):
    return (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )