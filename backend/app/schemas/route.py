from pydantic import BaseModel, Field


class RouteBase(BaseModel):
    route_name: str = Field(..., min_length=2)
    route_color: str = Field(..., min_length=2)
    total_stations: int = Field(default=0, ge=0)


class RouteCreate(RouteBase):
    pass


class RouteResponse(RouteBase):
    route_id: int

    class Config:
        from_attributes = True