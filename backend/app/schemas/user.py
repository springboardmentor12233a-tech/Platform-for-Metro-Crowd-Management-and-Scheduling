from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from typing import Literal
# ======================================================
# Registration
# ======================================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["Admin", "Operator", "Analyst", "Member"] = "Member"


# ======================================================
# Profile
# ======================================================

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class ProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2; use orm_mode=True if v1