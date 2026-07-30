from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generate this once and keep it fixed
hashed_password = "$2b$12$eImiTXuWVxfM37uY4JANjQeYj1J5L8J9M5FjV4hK2W5Dk4M0Y2QxG"

fake_users_db = {
    "admin": {
        "username": "admin",
        "password": "admin123",
        "role": "admin"
    }
}