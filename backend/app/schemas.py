from pydantic import BaseModel, EmailStr,Field
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role:Optional[str] ="user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class PredictionRequest(BaseModel):
    from_station: str = Field(alias="From_Station")
    to_station: str = Field(alias="To_Station")
    distance_km: float = Field(alias="Distance_km")
    fare: float = Field(alias="Fare")
    cost_per_passenger: float = Field(alias="Cost_per_passenger")
    ticket_type: str = Field(alias="Ticket_Type")
    remarks: str = Field(alias="Remarks")
    month: int = Field(alias="Month")
    weekday: str = Field(alias="Weekday")
    hour: int = Field(alias="Hour")
    weather: str = Field(alias="Weather")
    is_holiday: int = Field(alias="Is_Holiday")
    is_peak_hour: int = Field(alias="Is_Peak_Hour")
    

    model_config = {
        "populate_by_name": True
    }