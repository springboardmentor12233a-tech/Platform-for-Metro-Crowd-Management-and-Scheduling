from datetime import datetime
from pydantic import BaseModel


class ActivityLogBase(BaseModel):
    action: str
    module: str
    target: str | None = None
    status: str = "Success"
    ip_address: str | None = None


class ActivityLogCreate(ActivityLogBase):
    user_id: int
    user_name: str
    role: str


class ActivityLogResponse(ActivityLogBase):
    id: int
    user_id: int
    user_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True