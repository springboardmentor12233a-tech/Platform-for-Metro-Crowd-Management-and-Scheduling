"""
Authentication Dependencies
============================
FastAPI dependency functions that inject authentication into route handlers.
Use these as Depends() parameters on protected endpoints.

Usage:
    @router.get('/protected')
    async def protected_route(user = Depends(get_current_user)):
        return {'user': user}

    @router.delete('/admin-only')
    async def admin_route(user = Depends(require_admin)):
        return {'admin': user}
"""

from typing import Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.authentication.jwt_handler import decode_access_token

# ---------------------------------------------------------------------------
# HTTP Bearer Security Scheme
# This auto-populates the "Authorize" button in Swagger UI (/docs).
# ---------------------------------------------------------------------------
security = HTTPBearer(
    scheme_name="Bearer JWT",
    description="Enter the JWT token returned from POST /api/v1/auth/login",
    auto_error=True,  # Returns 403 automatically if the header is missing
)


# ---------------------------------------------------------------------------
# Core Authentication Dependency
# ---------------------------------------------------------------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """
    Extract and validate the current user from the JWT Bearer token.

    Raises:
        HTTPException 401: If the token is missing, malformed, or expired.

    Returns:
        Decoded JWT payload dict containing 'sub', 'email', 'role', etc.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Ensure the token has a subject claim
    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing required claims.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


# ---------------------------------------------------------------------------
# Role-Based Access Control Dependencies
# ---------------------------------------------------------------------------
def require_admin(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Require the current user to have the 'admin' role.

    Raises:
        HTTPException 403: If the user's role is not 'admin'.

    Returns:
        The authenticated user payload.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. Your role does not permit this action.",
        )
    return current_user


def require_operator_or_admin(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Require the current user to be an 'operator' or 'admin'.

    Raises:
        HTTPException 403: If the user is only an 'analyst' or has an unknown role.

    Returns:
        The authenticated user payload.
    """
    allowed_roles = {"admin", "operator"}
    if current_user.get("role") not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operator or Admin access required.",
        )
    return current_user


def require_any_authenticated(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Allow any authenticated user regardless of role.
    Alias for get_current_user — useful for semantic clarity in routes.
    """
    return current_user
