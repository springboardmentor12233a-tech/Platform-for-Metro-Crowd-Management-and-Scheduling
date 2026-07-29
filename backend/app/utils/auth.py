from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User


SECRET_KEY = "06a00af94f895ac0026291cdfc029393af85daaf5d8278545b031f5a16b9d76d"
ALGORITHM = "HS256"


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        email = payload.get("sub")


        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return user