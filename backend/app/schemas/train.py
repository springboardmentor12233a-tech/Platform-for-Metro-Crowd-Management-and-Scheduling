from pydantic import BaseModel, Field


class TrainBase(BaseModel):
    train_number: str = Field(..., min_length=2)
    train_name: str = Field(..., min_length=2)
    route_id: int
    capacity: int = Field(..., gt=0)
    status: str = "Active"


class TrainCreate(TrainBase):
    pass


class TrainUpdate(BaseModel):
    train_number: str = Field(..., min_length=2)
    train_name: str = Field(..., min_length=2)
    route_id: int
    capacity: int = Field(..., gt=0)
    status: str


class TrainResponse(TrainBase):
    train_id: int

    class Config:
        from_attributes = True