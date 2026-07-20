from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import engine, Base, get_db
from app import models, schemas, auth

from app.routers.prediction import router as prediction_router
from app.routers.forecast import router as forecast_router
from app.routers.schedule import router as schedule_router
from app.routers.frequency import router as frequency_router
from app.routers.monitoring import router as monitoring_router
from app.routers.report import router as report_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Metro Crowd Monitoring API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers
app.include_router(prediction_router)
app.include_router(forecast_router)
app.include_router(schedule_router)
app.include_router(frequency_router)
app.include_router(monitoring_router)
app.include_router(report_router)

# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Metro Crowd Monitoring API Running Successfully"
    }


# ---------------- REGISTER ----------------

@app.post("/register")
def register(
    user: schemas.UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = auth.hash_password(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully"
    }


# ---------------- LOGIN ----------------

@app.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    if not auth.verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = auth.create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ---------------- ADD CROWD DATA ----------------

@app.post("/crowd")
def add_crowd(
    crowd: schemas.CrowdCreate,
    db: Session = Depends(get_db)
):

    new_data = models.CrowdData(
        station_name=crowd.station_name,
        passenger_count=crowd.passenger_count,
        crowd_level=crowd.crowd_level
    )

    db.add(new_data)
    db.commit()
    db.refresh(new_data)

    return {
        "message": "Crowd Data Added Successfully"
    }


# ---------------- GET ALL CROWD DATA ----------------

@app.get(
    "/crowd",
    response_model=list[schemas.CrowdResponse]
)
def get_crowd(
    db: Session = Depends(get_db)
):

    crowd_data = db.query(
        models.CrowdData
    ).all()

    return crowd_data


# ---------------- UPDATE CROWD DATA ----------------

@app.put("/crowd/{id}")
def update_crowd(
    id: int,
    crowd: schemas.CrowdCreate,
    db: Session = Depends(get_db)
):

    data = db.query(models.CrowdData).filter(
        models.CrowdData.id == id
    ).first()

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Crowd Data Not Found"
        )

    data.station_name = crowd.station_name
    data.passenger_count = crowd.passenger_count
    data.crowd_level = crowd.crowd_level

    db.commit()
    db.refresh(data)

    return {
        "message": "Crowd Data Updated Successfully"
    }


# ---------------- DELETE CROWD DATA ----------------

@app.delete("/crowd/{id}")
def delete_crowd(
    id: int,
    db: Session = Depends(get_db)
):

    data = db.query(models.CrowdData).filter(
        models.CrowdData.id == id
    ).first()

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Crowd Data Not Found"
        )

    db.delete(data)
    db.commit()

    return {
        "message": "Crowd Data Deleted Successfully"
    }
    # ---------------- DASHBOARD SUMMARY ----------------

@app.get("/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_records = db.query(models.CrowdData).count()

    total_stations = db.query(
        func.count(
            func.distinct(models.CrowdData.station_name)
        )
    ).scalar()

    high = db.query(models.CrowdData).filter(
        models.CrowdData.crowd_level == "High"
    ).count()

    medium = db.query(models.CrowdData).filter(
        models.CrowdData.crowd_level == "Medium"
    ).count()

    low = db.query(models.CrowdData).filter(
        models.CrowdData.crowd_level == "Low"
    ).count()

    return {
        "total_records": total_records,
        "total_stations": total_stations,
        "high_crowd": high,
        "medium_crowd": medium,
        "low_crowd": low
    }


# ---------------- HIGH CROWD ----------------

@app.get("/dashboard/high-crowd")
def high_crowd(
    db: Session = Depends(get_db)
):

    return db.query(models.CrowdData).filter(
        models.CrowdData.crowd_level == "High"
    ).all()


# ---------------- RECENT RECORDS ----------------

@app.get("/dashboard/recent")
def recent_records(
    db: Session = Depends(get_db)
):

    return db.query(models.CrowdData).order_by(
        desc(models.CrowdData.timestamp)
    ).limit(10).all()


# ---------------- STATION LIST ----------------

@app.get("/dashboard/stations")
def station_list(
    db: Session = Depends(get_db)
):

    stations = db.query(
        models.CrowdData.station_name
    ).distinct().all()

    return {
        "stations": [station[0] for station in stations]
    }