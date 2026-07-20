import os
from datetime import datetime, timedelta

from bson import ObjectId
from jose import jwt
from passlib.context import CryptContext

from app.repositories.auth_repository import (
    find_user_by_email,
    create_user,
    find_user_by_id,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


def register_user(fullName: str, email: str, password: str):
    existing_user = find_user_by_email(email)

    if existing_user:
        raise Exception("User already exists")

    hashed_password = pwd_context.hash(password)

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
