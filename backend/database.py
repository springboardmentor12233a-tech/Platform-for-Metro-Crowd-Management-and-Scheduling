import os
import sqlite3

# Environment configurations for DB connections
POSTGRES_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/metroflow")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/metroflow")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

DB_PATH = os.path.join(os.path.dirname(__file__), "metroflow.db")

# Fallback In-Memory Cache store when Redis service is offline
_IN_MEMORY_CACHE = {}

# Fallback Document Store when MongoDB service is offline
_IN_MEMORY_DOCS = {
    "passenger_logs": [],
    "emergency_broadcasts": []
}

def get_sqlite_conn():
    """Returns SQLite connection to local database file."""
    if not os.path.exists(DB_PATH):
        # Trigger DB initialization if needed
        import init_db
        init_db.initialize_database()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection():
    """Primary DB getter function for FastAPI handlers."""
    return get_sqlite_conn()

def get_redis_client():
    """Returns Redis connection or dictionary fallback."""
    try:
        import redis
        client = redis.Redis.from_url(REDIS_URL, socket_timeout=1)
        client.ping()
        return client
    except Exception:
        # Fallback to simple dictionary cache interface
        class InMemoryRedisFallback:
            def get(self, key):
                return _IN_MEMORY_CACHE.get(key)
            def set(self, key, value, ex=None):
                _IN_MEMORY_CACHE[key] = value
                return True
            def delete(self, key):
                _IN_MEMORY_CACHE.pop(key, None)
                return True
        return InMemoryRedisFallback()

def get_mongo_collection(collection_name: str):
    """Returns MongoDB collection or dictionary list fallback."""
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1000)
        client.server_info() # verify connection
        db = client["metroflow"]
        return db[collection_name]
    except Exception:
        # Fallback document store
        class InMemoryMongoFallback:
            def __init__(self, coll_name):
                self.coll_name = coll_name
                if coll_name not in _IN_MEMORY_DOCS:
                    _IN_MEMORY_DOCS[coll_name] = []
                self.docs = _IN_MEMORY_DOCS[coll_name]
            
            def insert_one(self, doc):
                self.docs.append(doc)
                return True
            
            def find(self, query=None, limit=50):
                return self.docs[:limit]
            
            def count_documents(self, query=None):
                return len(self.docs)
        
        return InMemoryMongoFallback(collection_name)
