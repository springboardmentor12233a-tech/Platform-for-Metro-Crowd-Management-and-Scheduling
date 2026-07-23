from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, AuditLog
from app.schemas import Token, UserResponse, UserCreate
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.api.deps import get_current_user
import uuid

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    
    # Audit log login
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=user.id,
        action="LOGIN",
        details=f"User {user.username} logged in successfully."
    ))
    db.commit()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.username, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    user = db.query(User).filter(User.username == user_in.username).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    user_email = db.query(User).filter(User.email == user_in.email).first()
    if user_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
        
    db_user = User(
        id=uuid.uuid4(),
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role if user_in.role in ["admin", "operator", "station_master", "passenger"] else "passenger"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Audit log registration
    db.add(AuditLog(
        id=uuid.uuid4(),
        user_id=db_user.id,
        action="REGISTER",
        details=f"User {db_user.username} registered with role {db_user.role}."
    ))
    db.commit()
    
    return db_user

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user
