from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.user import User
from app.models.schemas import UserResponse
from app.services.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/operators", tags=["Operator Management"])

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Any logged-in user (admin or operator) can view their own profile."""
    return current_user

@router.get("/", response_model=List[UserResponse])
def list_all_operators(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """Admin-only: view all registered operators/admins."""
    return db.query(User).all()

@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_operator(user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """Admin-only: deactivate an operator account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user