from pydantic import BaseModel, EmailStr
from datetime import datetime

# ---------------- Register ----------------

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Operator"


# ---------------- Login ----------------

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------------- Token ----------------

class Token(BaseModel):
    access_token: str
    token_type: str


# ---------------- User Response ----------------

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


# ---------------- Crowd Create ----------------

class CrowdCreate(BaseModel):
    station_name: str
    passenger_count: int
    crowd_level: str


# ---------------- Crowd Response ----------------

class CrowdResponse(BaseModel):
    id: int
    station_name: str
    passenger_count: int
    crowd_level: str
    timestamp: datetime

    class Config:
        from_attributes = True
# ---------------- Prediction History ----------------

class PredictionHistoryCreate(BaseModel):
    station_name: str
    passenger_count: int
    predicted_crowd: str
    prediction_type: str | None = None
    predicted_by: str | None = None


class PredictionHistoryResponse(BaseModel):
    id: int
    station_name: str
    passenger_count: int
    predicted_crowd: str
    prediction_type: str | None = None
    predicted_by: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True