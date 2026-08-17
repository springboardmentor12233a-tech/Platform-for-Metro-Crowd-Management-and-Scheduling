from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models import User
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }