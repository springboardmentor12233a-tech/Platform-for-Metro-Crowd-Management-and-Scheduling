from pydantic import BaseModel, Field


class RouteBase(BaseModel):
    route_name: str = Field(..., min_length=2)
    route_color: str = Field(..., min_length=2)
    total_stations: int = Field(default=0, ge=0)


class RouteCreate(RouteBase):
    pass


from typing import Optional

class RouteUpdate(BaseModel):
    route_name: Optional[str] = Field(None, min_length=2)
    route_color: Optional[str] = Field(None, min_length=2)
    total_stations: Optional[int] = Field(None, ge=0)


class RouteResponse(RouteBase):
    route_id: int

    class Config:
        from_attributes = True