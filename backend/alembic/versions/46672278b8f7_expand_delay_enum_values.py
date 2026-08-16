"""expand delay enum values

Revision ID: 46672278b8f7
Revises: b08d4b0501e6
Create Date: 2026-08-13 00:16:47.577097
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.

revision: str = "46672278b8f7"
down_revision: Union[str, None] = "b08d4b0501e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # ---------------------------------------------------------
    # Transport Type
    # Existing: METRO
    # Add: BUS, TRAIN, TRAM
    # ---------------------------------------------------------

    op.execute(
        "ALTER TYPE transport_type "
        "ADD VALUE IF NOT EXISTS 'BUS'"
    )

    op.execute(
        "ALTER TYPE transport_type "
        "ADD VALUE IF NOT EXISTS 'TRAIN'"
    )

    op.execute(
        "ALTER TYPE transport_type "
        "ADD VALUE IF NOT EXISTS 'TRAM'"
    )

    # ---------------------------------------------------------
    # Weather Condition
    # Existing: SUNNY, CLOUDY, RAINY, STORM, FOG
    # Add: SNOW
    # ---------------------------------------------------------

    op.execute(
        "ALTER TYPE weather_condition "
        "ADD VALUE IF NOT EXISTS 'SNOW'"
    )


def downgrade() -> None:
    # PostgreSQL does not directly support removing
    # individual values from an ENUM type.
    pass