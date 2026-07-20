import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(
    os.getenv("MONGODB_URI"),
    serverSelectionTimeoutMS=5000
)

try:
    client.admin.command("ping")
    print("🍃 MongoDB Connected Successfully")
except Exception as e:
    print("❌ MongoDB Connection Failed:")
    print(e)
    raise

mongodb = client.get_default_database()