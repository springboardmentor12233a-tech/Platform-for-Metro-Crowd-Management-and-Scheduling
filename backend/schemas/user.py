import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from models.user import UserRole, UserStatus


# ── Request Schemas (what the client sends us) ───────────

class UserRegister(BaseModel):
    """Schema for POST /auth/register"""
    email: str = Field(..., max_length=255, examples=["admin@metroflow.com"])
    password: str = Field(..., min_length=8, max_length=128, examples=["SecurePass123!"])
    full_name: str = Field(..., max_length=100, examples=["Aditya Machal"])
    role: UserRole = Field(default=UserRole.viewer, examples=["operator"])
    phone: str | None = Field(default=None, max_length=20, examples=["+91-9876543210"])


class UserLogin(BaseModel):
    """Schema for POST /auth/login"""
    email: str = Field(..., examples=["admin@metroflow.com"])
    password: str = Field(..., examples=["SecurePass123!"])


class TokenRefreshRequest(BaseModel):
    """Schema for POST /auth/refresh"""
    refresh_token: str


# ── Response Schemas (what we send back) ─────────────────

class TokenResponse(BaseModel):
    """Returned after successful login or token refresh."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """
    Public user profile. Never includes password_hash.
    Used for GET /auth/me and in lists.
    """
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    status: UserStatus
    phone: str | None = None
    last_login_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    """Generic success/error message."""
    message: str
    detail: str | None = None
