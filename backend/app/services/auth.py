import uuid

from sqlalchemy.orm import Session

from app.models.user import User

from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
)


class AuthService:

    # ========================================================
    # ADMIN LOGIN
    # ========================================================

    @staticmethod
    def admin_login(
        db: Session,
        username: str,
        password: str,
    ):

        user = (
            db.query(User)
            .filter(
                User.username == username,
                User.role == "admin",
                User.auth_provider == "local",
            )
            .first()
        )

        if not user:
            return None

        # ----------------------------------------------------
        # Check account status
        # ----------------------------------------------------

        if not user.is_active:
            return None

        # ----------------------------------------------------
        # Check password exists
        # ----------------------------------------------------

        if not user.hashed_password:
            return None

        # ----------------------------------------------------
        # Verify password
        # ----------------------------------------------------

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        # ----------------------------------------------------
        # Create JWT tokens
        # ----------------------------------------------------

        access_token = create_access_token(
            user_id=user.id,
            role=user.role,
        )

        refresh_token = create_refresh_token(
            user_id=user.id,
            role=user.role,
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
        }

    # ========================================================
    # GOOGLE USER
    # ========================================================

    @staticmethod
    def get_or_create_google_user(
        db: Session,
        google_sub: str,
        email: str,
        name: str | None,
    ):

        # ----------------------------------------------------
        # 1. Find by Google subject
        # ----------------------------------------------------

        user = (
            db.query(User)
            .filter(
                User.google_sub == google_sub
            )
            .first()
        )

        if user:
            return user

        # ----------------------------------------------------
        # 2. Find by email
        # ----------------------------------------------------

        user = (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )

        if user:

            # ------------------------------------------------
            # Do NOT automatically convert a local admin
            # to Google authentication.
            # ------------------------------------------------

            if (
                user.role == "admin"
                and user.auth_provider == "local"
            ):
                raise ValueError(
                    "An admin account already exists "
                    "with this email."
                )

            # ------------------------------------------------
            # Existing normal Google user
            # ------------------------------------------------

            user.google_sub = google_sub
            user.auth_provider = "google"

            if name:
                user.full_name = name

            db.commit()
            db.refresh(user)

            return user

        # ----------------------------------------------------
        # 3. Create new Google user
        # ----------------------------------------------------

        user = User(
            id=str(uuid.uuid4()),

            username=None,

            email=email,

            full_name=name,

            role="user",

            hashed_password=None,

            google_sub=google_sub,

            is_active=True,

            auth_provider="google",
        )

        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    # ========================================================
    # GOOGLE JWT
    # ========================================================

    @staticmethod
    def create_google_tokens(
        user: User,
    ):

        access_token = create_access_token(
            user_id=user.id,
            role=user.role,
        )

        refresh_token = create_refresh_token(
            user_id=user.id,
            role=user.role,
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
        }

    # ========================================================
    # CHANGE ADMIN PASSWORD
    # ========================================================

    @staticmethod
    def change_admin_password(
        db: Session,
        user: User,
        current_password: str,
        new_password: str,
    ) -> bool:

        # ----------------------------------------------------
        # Only admins can change admin password
        # ----------------------------------------------------

        if user.role != "admin":
            return False

        # ----------------------------------------------------
        # Account must be active
        # ----------------------------------------------------

        if not user.is_active:
            return False

        # ----------------------------------------------------
        # Password must exist
        # ----------------------------------------------------

        if not user.hashed_password:
            return False

        # ----------------------------------------------------
        # Verify old password
        # ----------------------------------------------------

        if not verify_password(
            current_password,
            user.hashed_password,
        ):
            return False

        # ----------------------------------------------------
        # Validate new password
        # ----------------------------------------------------

        if not new_password:
            return False

        if len(new_password) < 8:
            return False

        # ----------------------------------------------------
        # Hash new password
        # ----------------------------------------------------

        user.hashed_password = hash_password(
            new_password
        )

        db.add(user)

        db.commit()

        db.refresh(user)

        return True