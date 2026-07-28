from datetime import datetime

from app.services.user_service import get_user_by_email


def update_profile(db, user, request):
    # Duplicate email check (excluding the current user's own row)
    if request.email is not None and request.email != user.email:
        existing = get_user_by_email(db, request.email)
        if existing and existing.id != user.id:
            raise ValueError("Email already in use")
        user.email = request.email

    if request.name is not None:
        user.name = request.name

    db.commit()
    db.refresh(user)

    return user


def record_login(db, user):
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user