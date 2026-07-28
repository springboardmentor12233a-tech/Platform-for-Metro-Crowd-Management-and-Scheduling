from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest

from app.auth.dependencies import get_current_user
from app.auth.hashing import (
    hash_password,
    verify_password,
)
from app.auth.jwt_handler import create_access_token

from app.services.user_service import (
    get_user_by_email,
    create_user,
    authenticate_user,
)
from app.services.auth_service import record_login

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

    # Record last login timestamp
    record_login(db, user)

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