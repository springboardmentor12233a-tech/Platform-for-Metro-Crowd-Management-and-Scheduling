from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth,operators,scheduling,predictions,monitoring
app = FastAPI(
    title="MetroFlow API",
    description="AI Platform for Metro Crowd Management and Scheduling",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(operators.router)
app.include_router(scheduling.router)
app.include_router(predictions.router)
app.include_router(monitoring.router)

@app.get("/")
def root():
    return {"message": "MetroFlow API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}