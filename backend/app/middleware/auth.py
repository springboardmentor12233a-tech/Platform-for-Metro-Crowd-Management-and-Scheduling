from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import os

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except Exception as e:
        print("JWT Error:", e)
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


def require_roles(allowed_roles: list):
    """
    RBAC Dependency

    Example:
        Depends(require_roles(["admin"]))
        Depends(require_roles(["admin", "manager"]))
    """

    def role_checker(current_user=Depends(get_current_user)):
        user_role = current_user.get("role")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action."
            )

        return current_user

    return role_checker