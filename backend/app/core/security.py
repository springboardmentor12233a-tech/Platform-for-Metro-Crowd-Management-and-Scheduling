from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from pwdlib import PasswordHash

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User


# ============================================================
# CONFIG
# ============================================================

SECRET_KEY = settings.JWT_SECRET_KEY

ALGORITHM = settings.JWT_ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = (
    settings.ACCESS_TOKEN_EXPIRE_MINUTES
)

REFRESH_TOKEN_EXPIRE_DAYS = (
    settings.REFRESH_TOKEN_EXPIRE_DAYS
)


password_hash = PasswordHash.recommended()


# ============================================================
# PASSWORD
# ============================================================

def hash_password(password: str) -> str:
    """
    Hash a password before storing it in the database.
    """

    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain password against the stored password hash.
    """

    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# ============================================================
# ACCESS TOKEN
# ============================================================

def create_access_token(
    user_id: str,
    role: str,
) -> str:
    """
    Create a short-lived JWT access token.
    """

    now = datetime.now(timezone.utc)

    expire = now + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# ============================================================
# REFRESH TOKEN
# ============================================================

def create_refresh_token(
    user_id: str,
    role: str,
) -> str:
    """
    Create a long-lived JWT refresh token.
    """

    now = datetime.now(timezone.utc)

    expire = now + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": user_id,
        "role": role,
        "type": "refresh",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# ============================================================
# DECODE TOKEN
# ============================================================

def decode_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate a JWT token.

    jwt.decode() verifies:
    - signature
    - expiration
    - allowed algorithm
    """

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
    )


# ============================================================
# BEARER AUTHENTICATION
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/admin/login"
)


# ============================================================
# CURRENT USER
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the currently authenticated user
    from the JWT access token.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired access token",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    # --------------------------------------------------------
    # Decode token
    # --------------------------------------------------------

    try:

        payload = decode_token(token)

        # Token must be an access token
        if payload.get("type") != "access":
            raise credentials_exception

        # Get database user ID
        user_id = payload.get("sub")

        if not user_id:
            raise credentials_exception

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    except jwt.InvalidTokenError:

        raise credentials_exception

    # --------------------------------------------------------
    # Find user in database
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # Check account status
    # --------------------------------------------------------

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    return user


# ============================================================
# ADMIN ONLY
# ============================================================

def require_admin(
    current_user: User = Depends(
        get_current_user
    ),
) -> User:
    """
    Allow only admin users.
    """

    if current_user.role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


# ============================================================
# AUTHENTICATED USER
# ============================================================

def require_authenticated_user(
    current_user: User = Depends(
        get_current_user
    ),
) -> User:
    """
    Allow both normal users and administrators.
    """

    return current_user