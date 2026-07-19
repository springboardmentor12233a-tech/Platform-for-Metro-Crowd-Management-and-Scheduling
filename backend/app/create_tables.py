from app.database.db import Base, engine
from app.models.user import User
from app.models.schedule import Train, Schedule
from app.models.alert import Alert

Base.metadata.create_all(bind=engine)
print("Tables created successfully.")