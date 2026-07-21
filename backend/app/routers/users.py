from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.auth.dependencies import require_roles

router = APIRouter(prefix="/users", tags=["User Management"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get(
    "/",
    response_model=list[UserResponse],
    dependencies=[Depends(require_roles("Admin"))],
)
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post(
    "/",
    response_model=UserResponse,
    dependencies=[Depends(require_roles("Admin"))],
)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        password=pwd_context.hash(user.password),
        role=user.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(require_roles("Admin"))],
)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = data.name
    user.email = data.email
    user.role = data.role

    db.commit()
    db.refresh(user)

    return user


@router.delete(
    "/{user_id}",
    dependencies=[Depends(require_roles("Admin"))],
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}