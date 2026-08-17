
from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.database import engine,Base
from app.routers.predict import router as predict_router
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.routers.dashboard import router as dashboard_router
from app.routers.llm_test import router as llm_router
from app.routers import alerts
from app.routers import announcement
from app.routers import dashboard
from app.routers import insights
from app.routers import heatmap
from app.routers import reports,user,report,profile



Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(dashboard_router)
app.include_router(llm_router)
app.include_router(alerts.router)
app.include_router(announcement.router)
app.include_router(dashboard.router)
app.include_router(insights.router)
app.include_router(heatmap.router)
app.include_router(reports.router)
app.include_router(user.router)
app.include_router(report.router)
app.include_router(profile.router)
@app.get("/")
def home():
    return {"message" : "Welcome to AI MetroFlow Backend"}
 
