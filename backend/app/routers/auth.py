from fastapi import APIRouter, Depends  # type: ignore
from sqlalchemy.orm import Session
from app.schemas import UserCreate
from app.utils.security import verify_password,hash_password,create_access_token

from app.database import get_db
from app.schemas import UserCreate,UserLogin
from app.models import User
from app.utils.security import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
  existing_user = db.query(User).filter(User.email == user.email).first()

  if existing_user:
    return {"message": "Email already registered"}

  hashed_password = hash_password(user.password)  
  new_user = User(
    name=user.name,
    email=user.email,
    password=hashed_password,
    role=user.role
  )

  db.add(new_user)
  db.commit()
  db.refresh(new_user)
 
  return {
    "message": "User registered successfully"
 }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"message": "Invalid email or password"}

    if not verify_password(user.password, db_user.password):
        return {"message": "Invalid email or password"}

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }