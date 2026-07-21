from enum import Enum


class Role(str, Enum):
    ADMIN = "Admin"
    OPERATOR = "Operator"
    ANALYST = "Analyst"
    MEMBER = "Member"


ALL_USERS = (
    Role.ADMIN,
    Role.OPERATOR,
    Role.ANALYST,
    Role.MEMBER,
)

STAFF = (
    Role.ADMIN,
    Role.OPERATOR,
    Role.ANALYST,
)

OPERATIONS = (
    Role.ADMIN,
    Role.OPERATOR,
)