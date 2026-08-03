import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.models.schemas import UserRegister, UserLogin, UserProfileUpdate, PasswordChange, UserResponse, TokenResponse
from backend.auth import verify_password, get_password_hash, create_access_token, get_current_user, require_roles
from backend.database import db_memory, is_mongo_connected, mongo_client, settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    # Check if user already exists
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        existing = await db.users.find_one({"email": user_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered.")
    else:
        for u in db_memory.users.values():
            if u["email"] == user_data.email:
                raise HTTPException(status_code=400, detail="Email already registered.")
                
    user_id = f"usr-{uuid.uuid4().hex[:6]}"
    hashed_pwd = get_password_hash(user_data.password)
    user_doc = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_pwd,
        "role": user_data.role,
        "is_active": True,
        "theme": "dark",
        "created_at": "2026-01-01T00:00:00"
    }
    
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.users.insert_one(user_doc)
        
    db_memory.users[user_id] = user_doc
    return user_doc

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_doc = None
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        user_doc = await db.users.find_one({"email": form_data.username})
    else:
        for u in db_memory.users.values():
            if u["email"] == form_data.username:
                user_doc = u
                break
                
    if not user_doc or not verify_password(form_data.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not user_doc.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
        
    access_token = create_access_token(data={"sub": user_doc["id"], "email": user_doc["email"], "role": user_doc["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_doc
    }

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        user_doc = await db.users.find_one({"id": user_id})
        if user_doc:
            return user_doc
            
    if user_id in db_memory.users:
        return db_memory.users[user_id]
        
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    update_fields = {}
    if profile_data.name is not None:
        update_fields["name"] = profile_data.name
    if profile_data.theme is not None:
        update_fields["theme"] = profile_data.theme
        
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.users.update_one({"id": user_id}, {"$set": update_fields})
        user_doc = await db.users.find_one({"id": user_id})
    else:
        if user_id in db_memory.users:
            db_memory.users[user_id].update(update_fields)
            user_doc = db_memory.users[user_id]
            
    return user_doc

@router.post("/change-password")
async def change_password(pwd_data: PasswordChange, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    user_doc = None
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        user_doc = await db.users.find_one({"id": user_id})
    else:
        user_doc = db_memory.users.get(user_id)
        
    if not user_doc or not verify_password(pwd_data.current_password, user_doc["password"]):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    new_hashed = get_password_hash(pwd_data.new_password)
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.users.update_one({"id": user_id}, {"$set": {"password": new_hashed}})
    else:
        db_memory.users[user_id]["password"] = new_hashed
        
    return {"message": "Password changed successfully."}

@router.get("/users", response_model=list[UserResponse])
async def list_users(current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        cursor = db.users.find({})
        users = await cursor.to_list(length=100)
        return users
    return list(db_memory.users.values())

@router.put("/users/{user_id}/status")
async def toggle_user_status(user_id: str, is_active: bool, current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.users.update_one({"id": user_id}, {"$set": {"is_active": is_active}})
    if user_id in db_memory.users:
        db_memory.users[user_id]["is_active"] = is_active
    return {"message": f"User status updated to {is_active}"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(require_roles(["Admin"]))):
    if is_mongo_connected and mongo_client:
        db = mongo_client[settings.DATABASE_NAME]
        await db.users.delete_one({"id": user_id})
    if user_id in db_memory.users:
        del db_memory.users[user_id]
    return {"message": "User deleted successfully."}
