from sqlalchemy.orm import Session
from app.repositories import route_repository


def create_route(db: Session, route_data):
    return route_repository.create_route(db, route_data)


def get_all_routes(db: Session):
    return route_repository.get_all_routes(db)


def get_route_by_id(db: Session, route_id: int):
    return route_repository.get_route_by_id(db, route_id)