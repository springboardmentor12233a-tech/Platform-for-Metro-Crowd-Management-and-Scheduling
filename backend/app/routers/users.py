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
    update_user_status,
)

from app.services.activity_log_service import (
    create_activity_log,
)


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
    current_user: User = Depends(
        require_roles("Admin")
    ),
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

    return user


# ======================================================
# Create User
# ======================================================

@router.post("/")
def add_user(
    request: UserCreate,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin")
    ),
):

    # --------------------------------------------------
    # Check duplicate email
    # --------------------------------------------------

    existing_user = get_user_by_email(
        db,
        request.email,
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )


    # --------------------------------------------------
    # Create User
    # --------------------------------------------------

    user = User(
        name=request.name,
        email=request.email,
        password=hash_password(
            request.password
        ),
        role=request.role,
    )


    db.add(user)

    db.commit()

    db.refresh(user)


    # --------------------------------------------------
    # Activity Log
    # --------------------------------------------------

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="Create User",
        module="User Management",
        target=user.email,
        status="Success",
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
    )


    return user


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


    # --------------------------------------------------
    # Check email belongs to another user
    # --------------------------------------------------

    existing_user = get_user_by_email(
        db,
        request.email,
    )

    if (
        existing_user
        and existing_user.id != user.id
    ):

        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )


    # --------------------------------------------------
    # Update Name
    # --------------------------------------------------

    user.name = request.name


    # --------------------------------------------------
    # Update Email
    # --------------------------------------------------

    user.email = request.email


    # --------------------------------------------------
    # Update Role
    # --------------------------------------------------

    user.role = request.role


    # --------------------------------------------------
    # Update Password
    # --------------------------------------------------

    if request.password:

        user.password = hash_password(
            request.password
        )


    # --------------------------------------------------
    # Save
    # --------------------------------------------------

    db.commit()

    db.refresh(user)


    # --------------------------------------------------
    # Activity Log
    # --------------------------------------------------

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action="Update User",
        module="User Management",
        target=user.email,
        status="Success",
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
    )


    return user


# ======================================================
# Activate / Deactivate User
# ======================================================

@router.patch("/{user_id}/status")
def change_status(
    user_id: int,
    is_active: bool,
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


    # --------------------------------------------------
    # Prevent changing your own status
    # --------------------------------------------------

    if user.id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail="You cannot change your own account status.",
        )


    # --------------------------------------------------
    # Update status
    # --------------------------------------------------

    updated_user = update_user_status(
        db,
        user,
        is_active,
    )


    # --------------------------------------------------
    # Activity Log
    # --------------------------------------------------

    create_activity_log(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,
        role=current_user.role,
        action=(
            "Activate User"
            if is_active
            else "Deactivate User"
        ),
        module="User Management",
        target=user.email,
        status="Success",
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
    )


    return updated_user


# ======================================================
# PERMANENTLY DELETE USER
# ======================================================

@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin")
    ),
):

    # --------------------------------------------------
    # Find user
    # --------------------------------------------------

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    # --------------------------------------------------
    # Prevent deleting yourself
    # --------------------------------------------------

    if user.id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account.",
        )


    target_email = user.email
    target_name = user.name


    try:

        # ==================================================
        # Remove Activity Logs
        # ==================================================
        #
        # ActivityLog.user_id may reference users.id.
        # Delete these records first so PostgreSQL does
        # not reject the user deletion because of a
        # foreign-key constraint.
        #
        # ==================================================

        db.query(ActivityLog).filter(
            ActivityLog.user_id == user.id
        ).delete(
            synchronize_session=False
        )


        # ==================================================
        # Permanently Delete User
        # ==================================================

        db.delete(user)

        db.commit()


    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to permanently delete user: "
                f"{str(exc)}"
            ),
        )


    # ==================================================
    # Create Admin Activity Log
    # ==================================================
    #
    # This is created AFTER deleting the target user.
    # The log belongs to the Admin performing the action.
    #
    # ==================================================

    try:

        create_activity_log(
            db=db,
            user_id=current_user.id,
            user_name=current_user.name,
            role=current_user.role,
            action="Delete User",
            module="User Management",
            target=target_email,
            status="Success",
            ip_address=(
                http_request.client.host
                if http_request.client
                else None
            ),
        )

    except Exception:

        # The deletion itself already succeeded.
        # Do not undo it if activity logging fails.

        db.rollback()


    # ==================================================
    # Response
    # ==================================================

    return {
        "message": "User permanently deleted successfully.",
        "action": "deleted",
        "user_id": user_id,
        "name": target_name,
        "email": target_email,
    }