from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.auth.jwt_handler import SECRET_KEY, ALGORITHM
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        print("=" * 60)
        print("TOKEN:", token)

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        print("PAYLOAD:", payload)

        email = payload.get("sub")
        print("EMAIL:", email)

        if email is None:
            print("EMAIL IS NONE")
            raise credentials_exception

    except Exception as e:
        print("JWT ERROR:", repr(e))
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    print("USER:", user)

    if user is None:
        print("USER NOT FOUND")
        raise credentials_exception

    print("ROLE:", user.role)

    return user


def require_roles(*roles: str) -> Callable:

    def role_checker(
        current_user: User = Depends(get_current_user),
    ):

        if current_user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )

        return current_user

    return role_checker