"""
JWT Token Handler
==================
Handles creation, signing, and verification of JWT access tokens.
Uses the `python-jose` library with HS256 symmetric signing.

Security Notes:
  - Tokens are signed with `settings.secret_key` — ensure it is a long,
    random string in production (at least 32 characters).
  - Tokens carry an `exp` claim and are validated on every decode.
  - Database lookup for users is stubbed for Milestone 1.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from jose import JWTError, jwt

from app.core.config import settings


# ---------------------------------------------------------------------------
# Token Creation
# ---------------------------------------------------------------------------
def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create and sign a JWT access token.

    Args:
        data:          Payload dict to encode. Must include at minimum 'sub' (subject).
        expires_delta: Custom token lifetime. Defaults to settings.access_token_expire_minutes.

    Returns:
        Signed JWT string.

    Example:
        token = create_access_token({'sub': '1', 'role': 'admin'})
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )

    to_encode.update(
        {
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "iss": settings.app_name,  # Issuer claim
        }
    )

    encoded_jwt: str = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    return encoded_jwt


# ---------------------------------------------------------------------------
# Token Decoding
# ---------------------------------------------------------------------------
def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT access token.

    Validates:
      - Signature integrity
      - Expiration (`exp` claim)
      - Issuer (`iss` claim) — must match app name

    Args:
        token: Raw JWT string (without 'Bearer ' prefix).

    Returns:
        Decoded payload dict, or None if the token is invalid/expired.
    """
    try:
        payload: Dict[str, Any] = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return payload
    except JWTError:
        # Catches ExpiredSignatureError, JWTClaimsError, etc.
        return None


# ---------------------------------------------------------------------------
# Quick Validation Helper
# ---------------------------------------------------------------------------
def verify_token(token: str) -> bool:
    """
    Quick boolean check whether a JWT token is currently valid.

    Args:
        token: Raw JWT string.

    Returns:
        True if valid and not expired, False otherwise.
    """
    return decode_access_token(token) is not None


# ---------------------------------------------------------------------------
# Payload Extraction Helpers
# ---------------------------------------------------------------------------
def get_user_id_from_token(token: str) -> Optional[str]:
    """Extract the user ID ('sub' claim) from a valid token."""
    payload = decode_access_token(token)
    if payload:
        return payload.get("sub")
    return None


def get_role_from_token(token: str) -> Optional[str]:
    """Extract the user role claim from a valid token."""
    payload = decode_access_token(token)
    if payload:
        return payload.get("role")
    return None
