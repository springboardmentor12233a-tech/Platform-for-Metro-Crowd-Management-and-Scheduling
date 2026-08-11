from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import get_db
from backend.models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    print("Email:", request.email)
    
    # Temporary login using username
    user = db.query(User).filter(User.email == request.email).first()

    print("User:", user)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print("Password:", request.password)

    # Temporary password check
    if request.password != "admin123":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "email": user.email,
            "full_name": user.full_name,
        }
    }