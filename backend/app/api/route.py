from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.route import RouteCreate, RouteResponse
from app.services import route_service

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/", response_model=RouteResponse)
def create_route(route: RouteCreate, db: Session = Depends(get_db)):
    return route_service.create_route(db, route)


@router.get("/", response_model=list[RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    return route_service.get_all_routes(db)


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route_by_id(db, route_id)

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    return route