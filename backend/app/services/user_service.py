from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(db: Session, user_id: int):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def get_all_users(db: Session):
    return db.query(User).order_by(User.id).all()


def create_user(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User):
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()


def authenticate_user(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def update_password(db: Session, user: User, hashed_password: str):
    user.password = hashed_password

    db.commit()
    db.refresh(user)

    return user


def get_users(
    db: Session,
    search: Optional[str] = None,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
):
    query = db.query(User)

    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )

    if role:
        query = query.filter(User.role == role)

    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    return query.order_by(User.id).all()


def update_user_role(
    db: Session,
    user: User,
    role: str,
):
    user.role = role

    db.commit()
    db.refresh(user)

    return user


def update_user_status(
    db: Session,
    user: User,
    is_active: bool,
):
    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return user


def update_user_details(
    db: Session,
    user: User,
    name: str,
    email: str,
):
    user.name = name
    user.email = email

    db.commit()
    db.refresh(user)

    return user