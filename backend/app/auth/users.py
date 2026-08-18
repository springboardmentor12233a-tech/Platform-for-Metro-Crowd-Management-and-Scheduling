from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


fake_users_db = {
    "admin": {
        "username": "admin",
        "name": "Administrator",
        "email": "admin@metroai.com",
        "mobile": "9999999999",
        "password": "admin123",
        "role": "admin",
    }
}