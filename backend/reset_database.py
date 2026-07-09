from app.database import engine, Base
from app.models import User, CrowdData

print("Dropping tables...")

CrowdData.__table__.drop(bind=engine, checkfirst=True)
User.__table__.drop(bind=engine, checkfirst=True)

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Done!")