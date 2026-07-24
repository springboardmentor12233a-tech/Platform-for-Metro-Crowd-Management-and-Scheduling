from sqlalchemy.orm import Session
from app.models.route import Route


def create_route(db: Session, route_data):
    route = Route(**route_data.dict())
    db.add(route)
    db.commit()
    db.refresh(route)
    return route


def get_all_routes(db: Session):
    return db.query(Route).all()


def get_route_by_id(db: Session, route_id: int):
    return db.query(Route).filter(Route.route_id == route_id).first()