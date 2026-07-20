from app.database.mongodb import mongodb


def get_users_collection():
    return mongodb["users"]


def find_user_by_email(email: str):
    return get_users_collection().find_one({"email": email})


def create_user(user_data: dict):
    result = get_users_collection().insert_one(user_data)
    return result.inserted_id


def find_user_by_id(user_id):
    from bson import ObjectId
    return get_users_collection().find_one({"_id": ObjectId(user_id)})