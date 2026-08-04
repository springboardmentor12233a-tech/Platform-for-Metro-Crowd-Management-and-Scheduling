from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.schemas.route import RouteCreate, RouteUpdate, RouteResponse
from app.services import route_service
from app.middleware.auth import require_roles

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/", response_model=RouteResponse)
def create_route(
    route: RouteCreate,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    return route_service.create_route(db, route)


@router.get("/", response_model=list[RouteResponse])
def get_routes(
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    return route_service.get_all_routes(db)


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(
    route_id: int,
    current_user=Depends(require_roles(["admin", "manager", "user"])),
    db: Session = Depends(get_db)
):
    route = route_service.get_route_by_id(db, route_id)

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    return route


@router.put("/{route_id}", response_model=RouteResponse)
def update_route(
    route_id: int,
    route: RouteUpdate,
    current_user=Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    updated = route_service.update_route(db, route_id, route)
    if not updated:
        raise HTTPException(status_code=404, detail="Route not found")
    return updated


@router.delete("/{route_id}")
def delete_route(
    route_id: int,
    current_user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    deleted = route_service.delete_route(db, route_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Route not found")
    return {"message": "Route deleted successfully"}