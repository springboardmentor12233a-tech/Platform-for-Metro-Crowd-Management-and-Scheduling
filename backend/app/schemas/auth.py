from datetime import datetime
from typing import Literal
from pydantic import BaseModel, EmailStr


# ===========================
# Login
# ===========================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# ===========================
# Register
# ===========================
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["Admin", "Operator", "Analyst", "Member"]


# ===========================
# Profile
# ===========================
class ProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime
    last_login: datetime | None = None

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    name: str
    email: EmailStr


# ===========================
# Password Reset
# ===========================
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str