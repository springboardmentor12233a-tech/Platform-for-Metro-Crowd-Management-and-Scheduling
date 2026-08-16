"""add authentication users

Revision ID: 1e3bb98e4b38
Revises: ad66a9a051ba
Create Date: 2026-08-11 22:32:02.873791

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# ============================================================
# Revision identifiers
# ============================================================

revision: str = "1e3bb98e4b38"

down_revision: Union[str, None] = "ad66a9a051ba"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


# ============================================================
# Upgrade
# ============================================================

def upgrade() -> None:

    op.create_table(

        "users",

        sa.Column(
            "id",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "username",
            sa.String(length=100),
            nullable=True,
        ),

        sa.Column(
            "email",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "full_name",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "role",
            sa.String(length=30),
            nullable=False,
            server_default="user",
        ),

        sa.Column(
            "hashed_password",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "google_sub",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),

        sa.Column(
            "auth_provider",
            sa.String(length=30),
            nullable=False,
            server_default="google",
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),

        sa.PrimaryKeyConstraint(
            "id"
        ),
    )


    # --------------------------------------------------------
    # Unique indexes
    # --------------------------------------------------------

    op.create_index(
        "ix_users_username",
        "users",
        ["username"],
        unique=True,
    )

    op.create_index(
        "ix_users_email",
        "users",
        ["email"],
        unique=True,
    )

    op.create_index(
        "ix_users_google_sub",
        "users",
        ["google_sub"],
        unique=True,
    )


# ============================================================
# Downgrade
# ============================================================

def downgrade() -> None:

    op.drop_index(
        "ix_users_google_sub",
        table_name="users",
    )

    op.drop_index(
        "ix_users_email",
        table_name="users",
    )

    op.drop_index(
        "ix_users_username",
        table_name="users",
    )

    op.drop_table("users")