"""add tourist card ticket type

Revision ID: a68f323f3c4e
Revises: 31d23b54bb53
Create Date: 2026-08-13 00:59:32.779556

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "a68f323f3c4e"
down_revision: Union[str, None] = "31d23b54bb53"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE ticket_type "
        "ADD VALUE IF NOT EXISTS 'TOURIST_CARD'"
    )


def downgrade() -> None:
    # PostgreSQL does not directly support removing
    # a value from an ENUM type.
    pass