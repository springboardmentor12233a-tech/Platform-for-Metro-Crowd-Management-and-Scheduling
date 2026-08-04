import os
from datetime import datetime
from bson import ObjectId
from app.database.mongodb import mongodb

def generate_alert(predicted_passengers: int, crowd_level: str):
    if crowd_level == "Very High":
        return {
            "status": True,
            "severity": "Critical",
            "type": "High Crowd",
            "message": "Immediate action required. Crowd level is extremely high."
        }

    elif crowd_level == "High":
        return {
            "status": True,
            "severity": "Warning",
            "type": "High Crowd",
            "message": "Crowd level is high. Monitor the station closely."
        }

    elif crowd_level == "Medium":
        return {
            "status": False,
            "severity": "Normal",
            "type": "Moderate Crowd",
            "message": "Crowd is within acceptable limits."
        }

    return {
        "status": False,
        "severity": "Low",
        "type": "Low Crowd",
        "message": "No alert generated."
    }


def get_alerts_collection():
    if mongodb is not None:
        return mongodb["alerts"]
    return None


def create_system_alert(alert_type: str, severity: str, message: str, station_id: int = None, train_id: int = None):
    """
    Inserts a new alert into MongoDB, with a graceful fallback.
    """
    col = get_alerts_collection()
    alert_doc = {
        "type": alert_type, # Overcrowding, Delay, Emergency, Schedule Update
        "severity": severity, # Info, Warning, Critical
        "message": message,
        "station_id": station_id,
        "train_id": train_id,
        "resolved": False,
        "created_at": datetime.utcnow()
    }
    
    if col is not None:
        try:
            result = col.insert_one(alert_doc)
            alert_doc["id"] = str(result.inserted_id)
            return alert_doc
        except Exception as e:
            print(f"[FALLBACK] MongoDB insert alert failed: {e}")
            alert_doc["id"] = "mock-alert-id"
            return alert_doc
    else:
        # Graceful fallback if MongoDB is not connected
        alert_doc["id"] = "mock-alert-id"
        return alert_doc


def fetch_system_alerts(limit: int = 50, unresolved_only: bool = False):
    """
    Fetches alerts from MongoDB, with a graceful fallback.
    """
    col = get_alerts_collection()
    if col is None:
        return []
    
    query = {}
    if unresolved_only:
        query["resolved"] = False
        
    try:
        cursor = col.find(query).sort("created_at", -1).limit(limit)
        alerts = []
        for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            alerts.append(doc)
        return alerts
    except Exception as e:
        print(f"[FALLBACK] MongoDB fetch alerts failed: {e}")
        return []


def resolve_system_alert(alert_id: str):
    """
    Marks an alert as resolved in MongoDB, with a graceful fallback.
    """
    col = get_alerts_collection()
    if col is None:
        return False
        
    try:
        result = col.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": {"resolved": True}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"[FALLBACK] MongoDB resolve alert failed: {e}")
        return False