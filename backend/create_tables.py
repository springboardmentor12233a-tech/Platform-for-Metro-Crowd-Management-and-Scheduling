from .database import engine
from .models import Base
# This creates ALL tables defined in models.py
Base.metadata.create_all(bind=engine)

print("✅ All 10 tables created successfully in PostgreSQL!")