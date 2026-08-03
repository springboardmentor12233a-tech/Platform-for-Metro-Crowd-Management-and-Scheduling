from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routes import alert_routes, analytics_routes, auth_routes, dashboard_routes, prediction_routes, scheduling_routes, station_routes
from app.seed import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetroFlow API",
    description="Milestones 1 to 3 for AI Metro Crowd Management and Scheduling Platform",
    version="1.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix=settings.API_PREFIX)
app.include_router(dashboard_routes.router, prefix=settings.API_PREFIX)
app.include_router(station_routes.router, prefix=settings.API_PREFIX)
app.include_router(scheduling_routes.router, prefix=settings.API_PREFIX)
app.include_router(prediction_routes.router, prefix=settings.API_PREFIX)
app.include_router(alert_routes.router, prefix=settings.API_PREFIX)
app.include_router(analytics_routes.router, prefix=settings.API_PREFIX)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "MetroFlow API is running",
        "docs": "/docs",
        "completed_milestones": "Milestone 1, Milestone 2, Milestone 3",
    }
