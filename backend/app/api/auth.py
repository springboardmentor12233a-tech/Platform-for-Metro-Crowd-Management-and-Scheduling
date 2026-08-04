from fastapi import APIRouter, HTTPException, Depends

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ChangeRoleRequest,
)

from app.services.auth_service import (
    register_user,
    login_user,
    get_profile,
    change_user_role,
)

from app.middleware.auth import (
    get_current_user,
    require_roles,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(request: RegisterRequest):
    try:
        return register_user(
            request.fullName,
            request.email,
            request.password
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(request: LoginRequest):
    try:
        return login_user(
            request.email,
            request.password
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    user = get_profile(current_user["id"])

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.patch(
    "/change-role",
    dependencies=[Depends(require_roles(["admin"]))]
)
def change_role(request: ChangeRoleRequest):
    """
    Admin only.
    Change any user's role.
    """

    try:
        return change_user_role(
            request.userId,
            request.role
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/users",
    dependencies=[Depends(require_roles(["admin"]))]
)
def get_users():
    """
    Admin only.
    List all users in the system.
    """
    from app.repositories.auth_repository import get_all_users
    try:
        users = get_all_users()
        serialized_users = []
        for user in users:
            serialized_users.append({
                "id": str(user["_id"]),
                "fullName": user.get("fullName", ""),
                "email": user.get("email", ""),
                "role": user.get("role", "user")
            })
        return serialized_users
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.delete(
    "/users/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))]
)
def delete_user_by_id(user_id: str):
    """
    Admin only.
    Delete user by ID.
    """
    from app.repositories.auth_repository import delete_user
    try:
        deleted = delete_user(user_id)
        if not deleted:
            raise Exception("User not found or could not be deleted")
        return {"success": True, "message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )