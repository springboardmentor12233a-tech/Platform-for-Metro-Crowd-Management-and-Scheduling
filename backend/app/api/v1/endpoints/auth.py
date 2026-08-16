from fastapi.security import OAuth2PasswordRequestForm
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from google.oauth2 import id_token
from google.auth.transport import requests

from app.database.session import get_db

from app.schemas.auth import (
    AdminLoginRequest,
    GoogleLoginRequest,
    TokenResponse,
    CurrentUserResponse,
)

from app.services.auth import AuthService

from app.core.config import settings
from app.core.security import get_current_user

from app.models.user import User


router = APIRouter()


# ============================================================
# ADMIN LOGIN
# ============================================================

# ============================================================
# ADMIN LOGIN
# ============================================================

@router.post(
    "/admin/login",
    response_model=TokenResponse,
)
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    tokens = AuthService.admin_login(
        db=db,
        username=form_data.username,
        password=form_data.password,
    )

    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin username or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    return tokens


# ============================================================
# GOOGLE LOGIN
# ============================================================

@router.post(
    "/google",
    response_model=TokenResponse,
)
def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db),
):

    try:

        google_user = id_token.verify_oauth2_token(
            request.credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential",
        )

    google_sub = google_user.get("sub")

    email = google_user.get("email")

    name = google_user.get("name")

    if not google_sub or not email:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google account",
        )
    
    try:

      user = AuthService.get_or_create_google_user(
        db=db,
        google_sub=google_sub,
        email=email,
        name=name,
    )

    except ValueError as e:

     raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=str(e),
    )

   

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    return AuthService.create_google_tokens(
        user
    )


# ============================================================
# CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def get_current_user_info(
    current_user: User = Depends(
        get_current_user
    ),
):

    return CurrentUserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        auth_provider=current_user.auth_provider,
    )