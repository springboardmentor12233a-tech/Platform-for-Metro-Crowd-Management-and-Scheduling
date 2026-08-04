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


def update_route(db: Session, route_id: int, route_update):
    db_route = get_route_by_id(db, route_id)
    if not db_route:
        return None
    update_data = route_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_route, key, value)
    db.commit()
    db.refresh(db_route)
    return db_route


def delete_route(db: Session, route_id: int):
    db_route = get_route_by_id(db, route_id)
    if not db_route:
        return None
    db.delete(db_route)
    db.commit()
    return db_route