import json
import os
from bson import ObjectId

from app.database.mongodb import mongodb

# Local JSON fallback DB file if MongoDB is offline/unreachable
MOCK_DB_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "users_local_db.json"
)


def load_local_users():
    if not os.path.exists(MOCK_DB_FILE):
        return {}
    try:
        with open(MOCK_DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}


def save_local_users(users):
    try:
        with open(MOCK_DB_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print("Failed to save local users:", e)


def get_users_collection():
    if mongodb is None:
        return None
    return mongodb["users"]


def find_user_by_email(email: str):
    coll = get_users_collection()
    if coll is None:
        users = load_local_users()
        for uid, u in users.items():
            if u.get("email") == email:
                u_copy = u.copy()
                u_copy["_id"] = uid
                return u_copy
        return None
    
    try:
        return coll.find_one({"email": email})
    except Exception as e:
        print(f"[FALLBACK] MongoDB find_user_by_email failed ({e}), using JSON DB.")
        users = load_local_users()
        for uid, u in users.items():
            if u.get("email") == email:
                u_copy = u.copy()
                u_copy["_id"] = uid
                return u_copy
        return None


def create_user(user_data: dict):
    coll = get_users_collection()
    if coll is None:
        users = load_local_users()
        uid = str(ObjectId())
        users[uid] = user_data
        save_local_users(users)
        return uid
    
    try:
        result = coll.insert_one(user_data)
        return result.inserted_id
    except Exception as e:
        print(f"[FALLBACK] MongoDB create_user failed ({e}), using JSON DB.")
        users = load_local_users()
        uid = str(ObjectId())
        users[uid] = user_data
        save_local_users(users)
        return uid


def find_user_by_id(user_id: str):
    coll = get_users_collection()
    user = None
    if coll is not None:
        try:
            user = coll.find_one({"_id": ObjectId(user_id)})
        except Exception as e:
            print(f"[FALLBACK] MongoDB find_user_by_id failed ({e}), fallback to JSON DB.")
            pass
            
    if not user:
        users = load_local_users()
        u = users.get(user_id)
        if u:
            u_copy = u.copy()
            u_copy["_id"] = user_id
            return u_copy
        return None
    return user


def get_user_by_id(user_id: str):
    return find_user_by_id(user_id)


def update_user_role(user_id: str, role: str):
    coll = get_users_collection()
    if coll is None:
        users = load_local_users()
        if user_id in users:
            users[user_id]["role"] = role
            save_local_users(users)
            return True
        return False
        
    try:
        result = coll.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": role}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"[FALLBACK] MongoDB update_user_role failed ({e}), using JSON DB.")
        users = load_local_users()
        if user_id in users:
            users[user_id]["role"] = role
            save_local_users(users)
            return True
        return False


def get_all_users():
    coll = get_users_collection()
    if coll is None:
        users = load_local_users()
        user_list = []
        for uid, u in users.items():
            u_copy = u.copy()
            u_copy["id"] = uid
            u_copy["_id"] = uid
            user_list.append(u_copy)
        return user_list

    try:
        cursor = coll.find()
        user_list = []
        for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            doc["_id"] = doc["id"]
            user_list.append(doc)
        return user_list
    except Exception as e:
        print(f"[FALLBACK] MongoDB get_all_users failed ({e}), using JSON DB.")
        users = load_local_users()
        user_list = []
        for uid, u in users.items():
            u_copy = u.copy()
            u_copy["id"] = uid
            u_copy["_id"] = uid
            user_list.append(u_copy)
        return user_list


def delete_user(user_id: str):
    coll = get_users_collection()
    if coll is None:
        users = load_local_users()
        if user_id in users:
            del users[user_id]
            save_local_users(users)
            return True
        return False
        
    try:
        result = coll.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"[FALLBACK] MongoDB delete_user failed ({e}), using JSON DB.")
        users = load_local_users()
        if user_id in users:
            del users[user_id]
            save_local_users(users)
            return True
        return False