from fastapi import FastAPI

app = FastAPI(
    title="MetroFlow API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to MetroFlow",
        "status": "API is running"
    }

@app.get("/crowd")
def get_crowd():
    return {
        "station": "Central Station",
        "passengers": 250,
        "crowd_level": "Medium"
    }
