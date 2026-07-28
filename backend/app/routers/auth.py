from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import (
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from app.auth.dependencies import get_current_user
from app.auth.hashing import (
    hash_password,
    verify_password,
)
from app.auth.jwt_handler import (
    create_access_token,
    create_reset_token,
    verify_reset_token,
)

from app.services.email_service import send_reset_email

from app.services.user_service import (
    get_user_by_email,
    create_user,
    authenticate_user,
    update_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ======================================================
# Register User
# ======================================================

@router.post("/register")
def register(
    request: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = get_user_by_email(
        db,
        request.email,
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_user = User(
        name=request.name,
        email=request.email,
        password=hash_password(request.password),
        role=request.role,
    )

    create_user(
        db,
        new_user,
    )

    return {
        "message": "User registered successfully"
    }


# ======================================================
# Login User
# ======================================================

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db,
        request.email,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        request.password,
        user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


# ======================================================
# Forgot Password
# ======================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(
        db,
        request.email,
    )

    # Always return the same message to avoid revealing
    # whether an email exists in the system.
    if not user:
        return {
            "message": "If the email exists, a password reset link has been sent."
        }

    token = create_reset_token(user.email)

    send_reset_email(
        user.email,
        token,
    )

    return {
        "message": "Password reset link sent successfully."
    }


# ======================================================
# Reset Password
# ======================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    email = verify_reset_token(
        request.token
    )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    hashed_password = hash_password(
        request.new_password
    )

    update_password(
        db,
        user,
        hashed_password,
    )

    return {
        "message": "Password reset successfully."
    }


# ======================================================
# Current Logged-in User
# ======================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }


# ======================================================
# Logout (Placeholder)
# ======================================================

@router.post("/logout")
def logout():
    """
    Placeholder logout endpoint.

    JWT authentication is stateless, so the frontend simply
    deletes the token from localStorage.

    Later we can implement:
    - Refresh Tokens
    - Token Blacklisting
    - Redis Session Storage
    """
    return {
        "message": "Logged out successfully"
    }