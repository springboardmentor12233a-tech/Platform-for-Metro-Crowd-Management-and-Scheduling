from fastapi import APIRouter, HTTPException

router = APIRouter()

# Dummy user data
users = {
    "admin": "admin123",
    "operator": "operator123"
}

@router.post("/login")
def login(username: str, password: str):
    if username in users and users[username] == password:
        return {
            "message": "Login successful",
            "user": username
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")
