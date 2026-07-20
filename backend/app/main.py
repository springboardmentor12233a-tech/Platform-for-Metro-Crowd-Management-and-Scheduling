from fastapi import FastAPI
from sqlalchemy import text

from app.database.mongodb import mongodb
from app.database.postgres import engine
from app.database.base import Base

from app.models.station import Station

from app.api.station import router as station_router
from app.api.auth import router as auth_router

app = FastAPI(title="AI MetroFlow API")

# Create PostgreSQL tables
Base.metadata.create_all(bind=engine)

# Register Routers
app.include_router(station_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "AI MetroFlow API Running"}


@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "PostgreSQL Connected"}
    except Exception as e:
        return {"status": "Connection Failed", "error": str(e)}