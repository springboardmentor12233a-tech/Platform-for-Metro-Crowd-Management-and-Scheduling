from app.auth.auth import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.dashboard import router
from app.ai.ai_router import router as ai_router

app = FastAPI(
    title="Metro Crowd Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router)
app.include_router(ai_router)

@app.get("/")
def home():
    return {"message": "Metro Crowd Management API is running successfully!"}

@app.get("/health")
def health():
    return {"status": "Healthy"}