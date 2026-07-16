"""
Authentication Endpoints
=========================
Handles user login and token generation.
Milestone 1: Uses dummy credentials — no database lookup.
"""
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, TokenResponse
from app.authentication.jwt_handler import create_access_token

router = APIRouter()

# Dummy user store — replace with DB lookup in Milestone 2
DUMMY_USERS = {
    "admin@metro.com": {"id": 1, "name": "Metro Admin", "role": "admin", "password": "admin123"},
    "operator@metro.com": {"id": 2, "name": "Station Operator", "role": "operator", "password": "operator123"},
    "analyst@metro.com": {"id": 3, "name": "Data Analyst", "role": "analyst", "password": "analyst123"},
}


@router.post("/login", response_model=TokenResponse, summary="User Login")
async def login(request: LoginRequest):
    """Authenticate a user and return a JWT access token."""
    user = DUMMY_USERS.get(request.email)
    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token_data = {"sub": str(user["id"]), "email": request.email, "role": user["role"]}
    token = create_access_token(token_data)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=1800,
        user={"id": user["id"], "name": user["name"], "email": request.email, "role": user["role"]},
    )


@router.post("/logout", summary="User Logout")
async def logout():
    """Invalidate a session. Token blacklisting is prepared for Milestone 2."""
    return {"status": "success", "message": "Logged out successfully"}


@router.get("/me", summary="Current User Profile")
async def get_me():
    """Return the current authenticated user's profile (stub)."""
    return {"id": 1, "name": "Metro Admin", "email": "admin@metro.com", "role": "admin", "is_active": True}
