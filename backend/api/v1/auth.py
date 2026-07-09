from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.database import get_db
from models.user import User, UserRole
from schemas.user import (
    UserRegister,
    UserLogin,
    TokenResponse,
    TokenRefreshRequest,
    UserResponse,
    MessageResponse,
)
from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from auth.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


# ── REGISTER ─────────────────────────────────────────────
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a new user account.
    - Checks if email already exists.
    - Hashes the password with bcrypt.
    - Defaults role to 'viewer' unless specified.
    """
    # Check if email is already taken
    existing = await db.execute(select(User).where(User.email == user_data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    # Create the user
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        phone=user_data.phone,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


# ── LOGIN ────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive JWT tokens",
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticates a user by email + password.
    Returns an access token (30 min) and a refresh token (7 days).
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Check account status
    if user.status.value != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.status.value}. Contact an administrator.",
        )

    # Generate tokens with user identity in payload
    token_data = {"sub": str(user.id), "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Update last login timestamp
    user.last_login_at = datetime.now(timezone.utc)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


# ── REFRESH TOKEN ────────────────────────────────────────
@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Get a new access token using a refresh token",
)
async def refresh_token(
    body: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Validates the refresh token and issues a new access + refresh token pair.
    The old refresh token is effectively replaced.
    """
    payload = decode_token(body.refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Issue new token pair
    token_data = {"sub": str(user.id), "role": user.role.value}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


# ── GET CURRENT USER PROFILE ────────────────────────────
@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the currently logged-in user's profile",
)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the profile of the authenticated user.
    Requires a valid access token in the Authorization header.
    """
    return current_user


# ── LIST ALL USERS (Admin only) ──────────────────────────
@router.get(
    "/users",
    response_model=list[UserResponse],
    summary="List all users (Admin only)",
)
async def list_users(
    current_user: User = Depends(require_role([UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns a list of all registered users.
    Only accessible by administrators.
    """
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return users
