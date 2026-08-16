import uuid
import getpass

from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password


def create_admin():

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Get admin credentials
        # ----------------------------------------------------

        username = input(
            "Enter admin username: "
        ).strip()

        password = getpass.getpass(
            "Enter admin password: "
        )

        confirm_password = getpass.getpass(
            "Confirm admin password: "
        )

        if not username:
            print("Username cannot be empty.")
            return

        if not password:
            print("Password cannot be empty.")
            return

        if password != confirm_password:
            print("Passwords do not match.")
            return

        # ----------------------------------------------------
        # Check existing username
        # ----------------------------------------------------

        existing = (
            db.query(User)
            .filter(
                User.username == username
            )
            .first()
        )

        if existing:

            print(
                f"User '{username}' already exists."
            )

            return

        # ----------------------------------------------------
        # Create admin
        # ----------------------------------------------------

        admin = User(

            id=str(uuid.uuid4()),

            username=username,

            email=None,

            full_name="Metro Administrator",

            role="admin",

            hashed_password=hash_password(
                password
            ),

            google_sub=None,

            is_active=True,

            auth_provider="local",

        )

        db.add(admin)

        db.commit()

        db.refresh(admin)

        print()
        print("====================================")
        print("Admin created successfully")
        print("====================================")
        print(f"Username : {admin.username}")
        print(f"Role     : {admin.role}")
        print(f"User ID  : {admin.id}")
        print("====================================")

    except Exception as e:

        db.rollback()

        print(
            f"Failed to create admin: {e}"
        )

    finally:

        db.close()


if __name__ == "__main__":

    create_admin()