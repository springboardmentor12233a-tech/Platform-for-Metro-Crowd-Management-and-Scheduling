from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_user


def require_roles(*allowed_roles):
    def role_checker(current_user=Depends(get_current_user)):
        print("=" * 60)
        print("Allowed Roles :", allowed_roles)
        print("Current Role  :", repr(current_user.role))
        print("=" * 60)

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource.",
            )

        return current_user

    return role_checker


def require_admin():
    return require_roles("Admin")


def require_operator():
    return require_roles("Operator")


def require_analyst():
    return require_roles("Analyst")


def require_member():
    return require_roles("Member")