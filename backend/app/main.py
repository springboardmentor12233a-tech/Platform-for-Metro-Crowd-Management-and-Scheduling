from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routes import auth_routes, dashboard_routes, station_routes
from app.seed import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetroFlow API",
    description="Milestone 1 backend for metro crowd monitoring and management.",
    version="1.0.0",
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


@app.on_event("startup")
def startup_event() -> None:
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
        "milestone": "Milestone 1",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
