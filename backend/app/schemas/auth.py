# from pydantic import BaseModel


# class LoginRequest(BaseModel):
#     username: str
#     password: str


# class TokenResponse(BaseModel):
#     access_token: str
#     token_type: str = "bearer"
from pydantic import BaseModel


class AdminLoginRequest(BaseModel):

    username: str

    password: str


class GoogleLoginRequest(BaseModel):

    credential: str


class TokenResponse(BaseModel):

    access_token: str

    refresh_token: str

    token_type: str = "bearer"

    role: str

    user_id: str


class CurrentUserResponse(BaseModel):

    id: str

    username: str | None = None

    email: str | None = None

    full_name: str | None = None

    role: str

    is_active: bool

    auth_provider: str