from pydantic import BaseModel, Field


# ============================================================
# NOTIFICATION PREFERENCES
# ============================================================

class NotificationPreferences(BaseModel):

    email_alerts: bool = True

    push_notifications: bool = True

    crowd_threshold: bool = True

    train_delays: bool = True

    system_updates: bool = False

    weekly_report: bool = False


# ============================================================
# SYSTEM PREFERENCES
# ============================================================

class SystemPreferences(BaseModel):

    refresh_interval: int = Field(
        default=30,
        ge=10,
    )

    timezone: str = "Asia/Kolkata"

    language: str = "en"

    theme: str = "dark"

    crowd_threshold: int = Field(
        default=80,
        ge=0,
        le=100,
    )


# ============================================================
# RESPONSE
# ============================================================

class UserPreferencesResponse(BaseModel):

    notifications: NotificationPreferences

    system: SystemPreferences


# ============================================================
# UPDATE
# ============================================================

class UserPreferencesUpdate(BaseModel):

    notifications: NotificationPreferences

    system: SystemPreferences