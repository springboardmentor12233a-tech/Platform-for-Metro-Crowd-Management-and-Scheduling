from sqlalchemy.orm import Session
from app.repositories import analytics_repository


def get_analytics_summary(db: Session):
    return analytics_repository.get_dashboard_summary(db)


def get_station_performance(db: Session):
    return analytics_repository.get_station_performance_metrics(db)


def get_route_performance(db: Session):
    return analytics_repository.get_route_performance_metrics(db)


def get_trends(db: Session):
    return analytics_repository.get_daily_trends(db)