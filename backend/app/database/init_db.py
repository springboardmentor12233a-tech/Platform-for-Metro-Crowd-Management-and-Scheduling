import logging
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
# from app.models.enums import UserRole
# from app.models import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Here you would typically seed initial data like an Admin user
    # Or static meta-data (like Metro lines)
    pass

def main() -> None:
    logger.info("Creating initial data")
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    logger.info("Initial data created")

if __name__ == "__main__":
    main()
