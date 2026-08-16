from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="MetroFlow API",
    version="0.1.0"
)

# Explicitly ensure Vite local dev ports are included
origins = list(settings.cors_origins) if hasattr(settings, "cors_origins") else []
for local_origin in ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]:
    if local_origin not in origins:
        origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catch unhandled exceptions and return JSON with status 500 (retaining CORS)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

app.include_router(
    api_router,
    prefix="/api/v1",
)

@app.get("/")
def root():
    return {"message": "Welcome to MetroFlow API"}