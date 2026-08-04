import os
from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

from app.repositories.auth_repository import (
    find_user_by_email,
    create_user,
    find_user_by_id,
    update_user_role,
    get_user_by_id,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# Valid roles for RBAC
VALID_ROLES = ["admin", "manager", "user"]


def register_user(fullName: str, email: str, password: str):
    existing_user = find_user_by_email(email)

    if existing_user:
        raise Exception("User already exists")

    hashed_password = pwd_context.hash(password)

    # Every new user starts as a normal user
    user = {
        "fullName": fullName,
        "email": email,
        "password": hashed_password,
        "role": "user",
    }

    user_id = create_user(user)

    return {
        "id": str(user_id),
        "fullName": fullName,
        "email": email,
        "role": "user",
    }


def login_user(email: str, password: str):
    user = find_user_by_email(email)

    if not user:
        # On-demand provisioning of demo credentials to ensure out-of-the-box ease of use
        if email == "admin@metroflow.ai" and password == "admin123":
            register_user("System Admin", "admin@metroflow.ai", "admin123")
            user = find_user_by_email(email)
            update_user_role(str(user["_id"]), "admin")
            user["role"] = "admin"
        elif email == "manager@metroflow.ai" and password == "manager123":
            register_user("Traffic Manager", "manager@metroflow.ai", "manager123")
            user = find_user_by_email(email)
            update_user_role(str(user["_id"]), "manager")
            user["role"] = "manager"
        elif email == "user@metroflow.ai" and password == "user123":
            register_user("Traveler User", "user@metroflow.ai", "user123")
            user = find_user_by_email(email)
        else:
            raise Exception("Invalid email or password")

    if not pwd_context.verify(password, user["password"]):
        raise Exception("Invalid email or password")

    token = jwt.encode(
        {
            "id": str(user["_id"]),
            "role": user["role"],
            "exp": datetime.utcnow() + timedelta(days=7),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"],
            "role": user["role"],
        },
    }


def get_profile(user_id: str):
    user = find_user_by_id(user_id)

    if not user:
        return None

    return {
        "id": str(user["_id"]),
        "fullName": user["fullName"],
        "email": user["email"],
        "role": user["role"],
    }


def change_user_role(user_id: str, role: str):
    """
    Change a user's role.
    Only Admin will be allowed to call this API
    (permission will be enforced in the router).
    """

    role = role.lower()

    if role not in VALID_ROLES:
        raise Exception(
            "Invalid role. Allowed roles are: admin, manager, user."
        )

    user = get_user_by_id(user_id)

    if not user:
        raise Exception("User not found")

    updated = update_user_role(user_id, role)

    if not updated:
        raise Exception("Role could not be updated")

    return {
        "success": True,
        "message": "User role updated successfully",
        "user": {
            "id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"],
            "role": role,
        },
    }


def get_all_roles():
    """
    Returns all valid system roles.
    Useful for frontend dropdowns.
    """
    return VALID_ROLES