from collections import Counter
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def get_dashboard_analytics(db: Session):
    logs = db.query(ActivityLog).all()

    total = len(logs)

    success = sum(
        1 for log in logs
        if (log.status or "").lower() == "success"
    )

    failed = sum(
        1 for log in logs
        if (log.status or "").lower() == "failed"
    )

    active_users = len(
        {log.user_name for log in logs}
    )

    # Login Trend
    login_counter = Counter()

    for log in logs:
        if log.created_at:
            login_counter[
                log.created_at.strftime("%Y-%m-%d")
            ] += 1

    login_trend = [
        {
            "date": date,
            "count": count,
        }
        for date, count in sorted(login_counter.items())
    ]

    # Module Distribution
    module_counter = Counter()

    for log in logs:
        module_counter[log.module] += 1

    module_distribution = [
        {
            "module": module,
            "count": count,
        }
        for module, count in module_counter.items()
    ]

    # Success / Failed
    success_rate = [
        {
            "name": "Success",
            "value": success,
        },
        {
            "name": "Failed",
            "value": failed,
        },
    ]

    # Top Users
    user_counter = Counter()

    for log in logs:
        user_counter[log.user_name] += 1

    top_users = [
        {
            "user": user,
            "count": count,
        }
        for user, count in user_counter.most_common(5)
    ]

    # Hourly Activity
    hourly_counter = Counter()

    for log in logs:
        if log.created_at:
            hourly_counter[log.created_at.hour] += 1

    hourly_activity = [
        {
            "hour": f"{hour:02d}:00",
            "count": hourly_counter.get(hour, 0),
        }
        for hour in range(24)
    ]

    return {
        "summary": {
            "total": total,
            "success": success,
            "failed": failed,
            "active_users": active_users,
        },
        "loginTrend": login_trend,
        "moduleDistribution": module_distribution,
        "successRate": success_rate,
        "topUsers": top_users,
        "hourlyActivity": hourly_activity,
    }