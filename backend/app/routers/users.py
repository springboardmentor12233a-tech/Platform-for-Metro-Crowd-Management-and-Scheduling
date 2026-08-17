from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.activity_log import ActivityLog

from app.auth.hashing import hash_password
from app.core.role_checker import require_roles

from app.schemas.user import (
    UserCreate,
    UserUpdate,
)

from app.services.user_service import (
    get_users,
    get_user_by_id,
    get_user_by_email,
    create_user,
    update_user_details,
    update_user_role,
    update_user_status,
    delete_user,
)
from app.services.activity_log_service import create_activity_log

router = APIRouter(
    prefix="/users",
    tags=["User Management"],
)


# ======================================================
# Get All Users
# ======================================================

@router.get("/")
def get_all_users(
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
):
    return get_users(
        db,
        search,
        role,
        is_active,
    )


# ======================================================
# Get User by ID
# ======================================================

@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# ======================================================
# Create User (Admin)
# ======================================================

@router.post("/")
def add_user(
    request: UserCreate,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
):
    if get_user_by_email(db, request.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = User(
        name=request.name,
        email=request.email,
        password=hash_password(request.password),
        role=request.role,
    )

    new_user = create_user(db, user)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="Create User",
        module="User Management",
        target=new_user.email,
        status="Success",
        ip_address=http_request.client.host,
    )

    return new_user


# ======================================================
# Update User
# ======================================================

@router.put("/{user_id}")
def edit_user(
    user_id: int,
    request: UserUpdate,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin")
    ),
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # ==========================================
    # Update Name
    # ==========================================

    user.name = request.name

    # ==========================================
    # Update Email
    # ==========================================

    user.email = request.email

    # ==========================================
    # Update Role
    # ==========================================

    user.role = request.role

    # ==========================================
    # Update Password
    # Only if admin entered a new password
    # ==========================================

    if request.password:
        user.password = hash_password(
            request.password
        )

    # ==========================================
    # Save Changes
    # ==========================================

    db.commit()
    db.refresh(user)

    # ==========================================
    # Activity Log
    # ==========================================

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="Update User",
        module="User Management",
        target=user.email,
        status="Success",
        ip_address=http_request.client.host,
    )

    return user


# ======================================================
# Activate / Deactivate User
# ======================================================

@router.patch("/{user_id}/status")
def change_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(404, "User not found")

    return update_user_status(
        db,
        user,
        is_active,
    )


# ======================================================
# Delete User
# ======================================================

@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(404, "User not found")

    # Prevent deleting yourself
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account.",
        )

    # Check if activity logs exist
    activity_count = (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == user.id)
        .count()
    )

    # If activity logs exist -> deactivate user
    if activity_count > 0:

        user.is_active = False
        db.commit()

        create_activity_log(
            db=db,
            user_id=current_user.id,
            user_name=current_user.name,
            role=current_user.role,
            action="Deactivate User",
            module="User Management",
            target=user.email,
            status="Success",
            ip_address=http_request.client.host,
        )

        return {
            "message": "User has activity history and has been deactivated instead of deleted.",
            "action": "deactivated",
        }

    # Otherwise delete normally
    target_email = user.email

    delete_user(db, user)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="Delete User",
        module="User Management",
        target=target_email,
        status="Success",
        ip_address=http_request.client.host,
    )

    return {
        "message": "User deleted successfully.",
        "action": "deleted",
    }