from fastapi import APIRouter, HTTPException, Depends

from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import (
    register_user,
    login_user,
    get_profile,
)
from app.middleware.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(request: RegisterRequest):
    try:
        return register_user(
            request.fullName,
            request.email,
            request.password
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(request: LoginRequest):
    return login_user(
        request.email,
        request.password
    )


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    user = get_profile(current_user["id"])

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user