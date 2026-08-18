from pydantic import BaseModel, ConfigDict


# ------------------------------------------------
# CREATE TRAIN REQUEST
# ------------------------------------------------

class TrainCreate(BaseModel):
    train_number: str
    train_name: str
    line: str
    train_type: str = "Standard"
    capacity: int
    coaches: int
    status: str = "Active"


# ------------------------------------------------
# TRAIN RESPONSE
# ------------------------------------------------

class TrainResponse(BaseModel):
    id: int
    train_number: str
    train_name: str
    line: str
    train_type: str
    capacity: int
    coaches: int
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )