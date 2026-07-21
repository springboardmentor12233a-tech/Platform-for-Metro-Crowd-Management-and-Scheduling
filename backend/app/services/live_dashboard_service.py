from app.services.dashboard_service import get_dashboard_summary
from app.services.prediction_history_service import get_prediction_history
from app.services.alert_service import get_alerts


def get_live_dashboard(db):
    # Dashboard service uses injected db
    dashboard = get_dashboard_summary(db)

    # These services create their own SessionLocal internally
    history = get_prediction_history()
    alerts = get_alerts()

    latest_prediction = history[0] if history else None

    return {
        "summary": dashboard,
        "latest_prediction": latest_prediction,
        "recent_history": history[:5],
        "alerts": alerts[:5],
    }