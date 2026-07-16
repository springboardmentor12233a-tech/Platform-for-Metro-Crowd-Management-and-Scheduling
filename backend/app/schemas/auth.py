"""
Authentication Schemas
=======================
Pydantic models for all authentication-related request bodies and responses.
Validated automatically by FastAPI on every request/response cycle.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    """
    Request body for POST /api/v1/auth/login.

    Attributes:
        email: Valid email address of the user.
        password: Plain-text password (transmitted over HTTPS only).
    """

    email: EmailStr
    password: str

    model_config = {"json_schema_extra": {"example": {"email": "admin@metro.com", "password": "admin123"}}}


class TokenResponse(BaseModel):
    """
    Response body returned after a successful login.

    Attributes:
        access_token: Signed JWT Bearer token.
        token_type:   Always 'bearer' per OAuth2 convention.
        expires_in:   Token lifetime in seconds.
        user:         Basic profile of the authenticated user.
    """

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 1800,
                "user": {"id": 1, "name": "Metro Admin", "email": "admin@metro.com", "role": "admin"},
            }
        }
    }


class UserProfile(BaseModel):
    """
    Serialized user profile returned from GET /api/v1/auth/me.

    Attributes:
        id:        Unique user identifier.
        name:      Full display name.
        email:     User's email address.
        role:      Access role: 'admin' | 'operator' | 'analyst'.
        is_active: Whether the account is currently active.
    """

    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "name": "Metro Admin",
                "email": "admin@metro.com",
                "role": "admin",
                "is_active": True,
            }
        }
    }


class ChangePasswordRequest(BaseModel):
    """Request body for changing a user's password (prepared for Milestone 2)."""

    current_password: str
    new_password: str
    confirm_password: str
