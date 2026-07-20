from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    fullName: str
    email: EmailStr
    role: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    token: str
    user: UserResponse