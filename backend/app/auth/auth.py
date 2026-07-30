from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth.users import fake_users_db
from app.auth.jwt_handler import create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(user: LoginRequest):

    db_user = fake_users_db.get(user.username)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Username")

    if user.password != db_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid Password")

    token = create_access_token(
        {
            "sub": db_user["username"],
            "role": db_user["role"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user["role"],
    }