from datetime import datetime

from pydantic import BaseModel


# =========================================================
# CREATE EMERGENCY ALERT
# =========================================================

class EmergencyAlertCreate(BaseModel):
    station: str
    message: str
    severity: str
    alert_type: str


# =========================================================
# ALERT RESPONSE
# =========================================================

class AlertResponse(BaseModel):
    station: str
    predicted_passengers: int
    severity: str
    recommendation: str
    created_at: datetime

    # AI GENERATED / MANUAL EMERGENCY
    source: str = "AI Generated"

    # Emergency type for manual alerts
    alert_type: str | None = None