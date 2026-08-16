from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import get_current_user

from app.models.user import User
from app.models.user_preferences import UserPreferences

from app.schemas.user_preferences import (
    UserPreferencesResponse,
    UserPreferencesUpdate,
    NotificationPreferences,
    SystemPreferences,
)


router = APIRouter()


# ============================================================
# GET SETTINGS
# ============================================================

@router.get(
    "/",
    response_model=UserPreferencesResponse,
)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    preferences = (
        db.query(UserPreferences)
        .filter(
            UserPreferences.user_id
            == current_user.id
        )
        .first()
    )

    # --------------------------------------------------------
    # Create default settings if user doesn't have them yet
    # --------------------------------------------------------

    if preferences is None:

        preferences = UserPreferences(
            user_id=current_user.id,

            email_alerts=True,

            push_notifications=True,

            crowd_threshold_alerts=True,

            train_delay_notifications=True,

            system_updates=(
                current_user.role == "admin"
            ),

            weekly_report=(
                current_user.role == "admin"
            ),

            refresh_interval=30,

            timezone="Asia/Kolkata",

            language="en",

            theme="dark",

            crowd_threshold=80,
        )

        db.add(preferences)

        db.commit()

        db.refresh(preferences)

    # --------------------------------------------------------
    # Return frontend structure
    # --------------------------------------------------------

    return UserPreferencesResponse(

        notifications=NotificationPreferences(

            email_alerts=
                preferences.email_alerts,

            push_notifications=
                preferences.push_notifications,

            crowd_threshold=
                preferences.crowd_threshold_alerts,

            train_delays=
                preferences.train_delay_notifications,

            system_updates=
                preferences.system_updates,

            weekly_report=
                preferences.weekly_report,
        ),

        system=SystemPreferences(

            refresh_interval=
                preferences.refresh_interval,

            timezone=
                preferences.timezone,

            language=
                preferences.language,

            theme=
                preferences.theme,

            crowd_threshold=
                preferences.crowd_threshold,
        ),
    )


# ============================================================
# UPDATE SETTINGS
# ============================================================

@router.put(
    "/",
    response_model=UserPreferencesResponse,
)
def update_settings(
    request: UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    preferences = (
        db.query(UserPreferences)
        .filter(
            UserPreferences.user_id
            == current_user.id
        )
        .first()
    )

    # --------------------------------------------------------
    # Create if missing
    # --------------------------------------------------------

    if preferences is None:

        preferences = UserPreferences(
            user_id=current_user.id,
        )

        db.add(preferences)

    # ========================================================
    # Notification settings
    # ========================================================

    preferences.email_alerts = (
        request.notifications.email_alerts
    )

    preferences.push_notifications = (
        request.notifications.push_notifications
    )

    preferences.crowd_threshold_alerts = (
        request.notifications.crowd_threshold
    )

    preferences.train_delay_notifications = (
        request.notifications.train_delays
    )

    preferences.system_updates = (
        request.notifications.system_updates
    )

    preferences.weekly_report = (
        request.notifications.weekly_report
    )

    # ========================================================
    # System settings
    # ========================================================

    preferences.refresh_interval = (
        request.system.refresh_interval
    )

    preferences.timezone = (
        request.system.timezone
    )

    preferences.language = (
        request.system.language
    )

    preferences.theme = (
        request.system.theme
    )

    preferences.crowd_threshold = (
        request.system.crowd_threshold
    )

    db.commit()

    db.refresh(preferences)

    # ========================================================
    # Return updated settings
    # ========================================================

    return UserPreferencesResponse(

        notifications=NotificationPreferences(

            email_alerts=
                preferences.email_alerts,

            push_notifications=
                preferences.push_notifications,

            crowd_threshold=
                preferences.crowd_threshold_alerts,

            train_delays=
                preferences.train_delay_notifications,

            system_updates=
                preferences.system_updates,

            weekly_report=
                preferences.weekly_report,
        ),

        system=SystemPreferences(

            refresh_interval=
                preferences.refresh_interval,

            timezone=
                preferences.timezone,

            language=
                preferences.language,

            theme=
                preferences.theme,

            crowd_threshold=
                preferences.crowd_threshold,
        ),
    )