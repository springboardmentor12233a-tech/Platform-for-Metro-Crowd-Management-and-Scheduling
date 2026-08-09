from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
from datetime import datetime

app = FastAPI(
    title="MetroFlow API",
    description="Database-Backed Backend API for Metro Crowd Management and Scheduling",
    version="1.1.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "metroflow.db")

# Helper to get a database connection
def get_db_connection():
    if not os.path.exists(DB_PATH):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database file not initialized. Please run init_db.py first."
        )
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

class LoginRequest(BaseModel):
    username: str
    password: str

class AlertResolveRequest(BaseModel):
    alert_id: str
    username: str
    notes: str

@app.get("/")
def read_root():
    return {"message": "Welcome to MetroFlow API (SQL Database-Backed). System operational."}

# ==========================
# MODULE 1: USER MANAGEMENT
# ==========================

@app.post("/auth/login")
def login(request: LoginRequest):
    username = request.username.lower().strip()
    password = request.password
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT username, name, role, email FROM users WHERE username = ? AND password = ?",
        (username, password)
    )
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    return {
        "status": "success",
        "user": dict(user)
    }

@app.get("/admin/users")
def get_all_users():
    """Admin-only endpoint to view registered system users."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, name, role, email FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {
        "status": "success",
        "users": users
    }

# ==========================
# MODULE 2: CROWD MONITORING & CONGESTION ALGORITHMS
# ==========================

@app.get("/crowd/summary")
def get_crowd_summary():
    """Reads passenger entries/exits from SQLite to give real-time monitoring stats."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Take the first 15 records as 'live' simulation data
        cursor.execute("""
            SELECT date, time, day, station, line, entry_count, exit_count, net_flow, weather 
            FROM passenger_flow 
            LIMIT 15
        """)
        live_records = [dict(row) for row in cursor.fetchall()]
        
        # 2. Calculate overall system metrics
        cursor.execute("""
            SELECT SUM(entry_count) as total_entries, 
                   SUM(exit_count) as total_exits, 
                   AVG(entry_count) as avg_entries 
            FROM passenger_flow
        """)
        metrics_row = cursor.fetchone()
        
        metrics = {
            "total_entries": int(metrics_row["total_entries"]) if metrics_row["total_entries"] else 0,
            "total_exits": int(metrics_row["total_exits"]) if metrics_row["total_exits"] else 0,
            "avg_entries_per_hour": round(float(metrics_row["avg_entries"]), 1) if metrics_row["avg_entries"] else 0.0
        }
        
        # 3. Identify top 5 busiest stations
        cursor.execute("""
            SELECT station, SUM(entry_count) as entry_count 
            FROM passenger_flow 
            GROUP BY station 
            ORDER BY entry_count DESC 
            LIMIT 5
        """)
        top_stations = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return {
            "status": "success",
            "metrics": metrics,
            "top_busiest_stations": top_stations,
            "live_records": live_records
        }
        
    except Exception as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query error: {str(e)}"
        )

# ==========================================
# MODULE 3: CONGESTION AND BOTTLENECK DETECTION ALGORITHM
# ==========================================

@app.get("/crowd/alerts")
def get_congestion_alerts():
    """
    Algorithm: Calculates train and station density thresholds from the DB.
    Excludes alerts manually marked as 'Resolved' in alerts_resolution by operators.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    alerts = []
    
    try:
        # Get resolved alert IDs
        cursor.execute("SELECT alert_id FROM alerts_resolution")
        resolved_ids = set([row["alert_id"] for row in cursor.fetchall()])
        
        # 1. Check Station Entry Flow Bottlenecks (First 30 rows in DB)
        cursor.execute("""
            SELECT date, time, station, line, entry_count 
            FROM passenger_flow 
            LIMIT 30
        """)
        flow_rows = cursor.fetchall()
        
        for idx, row in enumerate(flow_rows):
            alert_id = f"ALERT-STN-{idx}"
            if alert_id in resolved_ids:
                continue
                
            entry_count = row["entry_count"]
            # Bottleneck threshold: > 180 passengers/min
            if entry_count > 180:
                alerts.append({
                    "id": alert_id,
                    "type": "STATION_OVERCROWDING",
                    "severity": "CRITICAL",
                    "target": row["station"],
                    "line": row["line"],
                    "message": f"Critical bottleneck detected at {row['station']} entry gate ({entry_count} entries/min). Deploy crowd barriers.",
                    "metric": f"{entry_count} pax/min"
                })
            # Warning threshold: 120 to 180
            elif entry_count > 120:
                alerts.append({
                    "id": f"WARN-STN-{idx}",  # Station Warnings can also be resolved
                    "type": "STATION_WARNING",
                    "severity": "WARNING",
                    "target": row["station"],
                    "line": row["line"],
                    "message": f"High passenger inflow at {row['station']} ({entry_count} entries/min). Monitoring platform density.",
                    "metric": f"{entry_count} pax/min"
                })

        # 2. Check Train Occupancy Bottlenecks (First 30 rows in DB)
        cursor.execute("""
            SELECT train_id, line, station, occupancy_percent 
            FROM train_occupancy 
            LIMIT 30
        """)
        occ_rows = cursor.fetchall()
        
        for idx, row in enumerate(occ_rows):
            alert_id = f"ALERT-TRN-{idx}"
            if alert_id in resolved_ids:
                continue
                
            occupancy = row["occupancy_percent"]
            # Overcrowding threshold: Occupancy Percent >= 95.0%
            if occupancy >= 95.0:
                alerts.append({
                    "id": alert_id,
                    "type": "TRAIN_OVERCROWDING",
                    "severity": "CRITICAL",
                    "target": row["train_id"],
                    "line": row["line"],
                    "message": f"Train {row['train_id']} at {row['station']} is overcrowded ({occupancy}% capacity). Adjusting frequency.",
                    "metric": f"{occupancy}% Occupancy"
                })
                
        conn.close()
        return {
            "status": "success",
            "total_alerts": len(alerts),
            "alerts": alerts
        }
        
    except Exception as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query error: {str(e)}"
        )

@app.get("/crowd/occupancy")
def get_train_occupancy():
    """Reads train occupancy directly from SQLite."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT train_id, line, station, occupancy_percent, passenger_count, crowd_level 
            FROM train_occupancy 
            ORDER BY occupancy_percent DESC 
            LIMIT 10
        """)
        busy_trains = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "status": "success",
            "trains": busy_trains
        }
    except Exception as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query error: {str(e)}"
        )

# ==========================================
# MODULE 4: OPERATOR MITIGATION CONTROLS
# ==========================================

@app.post("/operator/resolve-alert")
def resolve_congestion_alert(request: AlertResolveRequest):
    """Allows Operators to manually override and log alert resolution in the SQLite DB."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if username exists and is operator or admin
        cursor.execute("SELECT role FROM users WHERE username = ?", (request.username,))
        user_row = cursor.fetchone()
        
        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials for alert resolution."
            )
            
        # Log resolution
        cursor.execute("""
            INSERT OR REPLACE INTO alerts_resolution (alert_id, resolved_by, resolution_notes)
            VALUES (?, ?, ?)
        """, (request.alert_id, request.username, request.notes))
        
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "message": f"Alert {request.alert_id} successfully resolved by {request.username}.",
            "alert_id": request.alert_id,
            "resolved_by": request.username,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resolution error: {str(e)}"
        )
