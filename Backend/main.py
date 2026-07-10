from fastapi import FastAPI
from database import engine, Base, SessionLocal
import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "MetroFlow API running"}

@app.post("/stations")
def add_station(name: str, capacity: int = 1000):
    db = SessionLocal()
    station = models.Station(name=name, capacity=capacity)
    db.add(station)
    db.commit()
    db.refresh(station)
    db.close()
    return station


@app.get("/stations")
def list_stations():
    db = SessionLocal()
    stations = db.query(models.Station).all()
    db.close()
    return stations

@app.put("/stations/{station_id}")
def update_station(station_id: int, name: str = None, capacity: int = None):
    db = SessionLocal()
    station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if not station:
        db.close()
        return {"error": "Station not found"}
    if name:
        station.name = name
    if capacity:
        station.capacity = capacity
    db.commit()
    db.refresh(station)
    db.close()
    return station


@app.delete("/stations/{station_id}")
def delete_station(station_id: int):
    db = SessionLocal()
    station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if not station:
        db.close()
        return {"error": "Station not found"}
    db.delete(station)
    db.commit()
    db.close()
    return {"message": f"Station {station_id} deleted"}