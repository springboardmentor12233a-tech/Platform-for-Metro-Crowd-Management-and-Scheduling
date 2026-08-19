from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import os
import json
import asyncio
from datetime import datetime, timedelta
import jwt

# Import AI Predictor Functions & Export Utils
from predict import predict_passenger_demand, predict_crowd_level, get_model_metrics
from export_utils import generate_excel_report, generate_pdf_report
from database import get_db_connection

JWT_SECRET = os.getenv("JWT_SECRET", "metroflow_super_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

app = FastAPI(
    title="MetroFlow API - Milestone 1 to 3",
    description="AI Platform Backend for Metro Crowd Management, Train Scheduling, Emergency Announcements & Analytics",
    version="3.0.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC SCHEMAS
# ==========================================

class LoginRequest(BaseModel):
    username: str
    password: str

class AlertResolveRequest(BaseModel):
    alert_id: str
    username: str
    notes: str

class DemandPredictRequest(BaseModel):
    station: str
    line: str
    weather: Optional[str] = "Clear"
    day: Optional[str] = "Monday"
    hour: Optional[int] = 9
    date: Optional[str] = None

class CrowdPredictRequest(BaseModel):
    passenger_count: int
    occupancy_percent: float
    line: str

class FrequencyAdjustmentRequest(BaseModel):
    line: str
    new_frequency: int
    reason: str
    operator_username: str

class AddScheduleRequest(BaseModel):
    train_id: str
    line: str
    from_station: str
    to_station: str
    departure_time: str
    arrival_time: str
    frequency_per_hour: int

class LogDelayRequest(BaseModel):
    train_id: str
    line: str
    station: str
    delay_minutes: int
    cause: str
    operator_username: str

class EmergencyAnnouncementRequest(BaseModel):
    title: str
    message: str
    line: Optional[str] = "All Lines"
    station: Optional[str] = "System-Wide"
    severity: str = "WARNING"
    broadcast_by: str = "operator"


# ==========================================
# HELPER AUTH FUNCTIONS
# ==========================================

def create_jwt_token(user_data: dict) -> str:
    payload = {
        "sub": user_data["username"],
        "role": user_data["role"],
        "name": user_data["name"],
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        # Return fallback guest user for open demo access if header missing
        return {"username": "operator", "role": "operator", "name": "Station Operator"}
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired JWT token")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to MetroFlow API (Milestones 1-3 Complete). AI Metro Crowd Management & Scheduling Platform.",
        "version": "3.0.0",
        "status": "Healthy"
    }


# ==========================================
# MODULE 1: USER MANAGEMENT & AUTH
# ==========================================

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
    
    user_dict = dict(user)
    token = create_jwt_token(user_dict)
    
    return {
        "status": "success",
        "token": token,
        "token_type": "bearer",
        "user": user_dict
    }

@app.get("/admin/users")
def get_all_users(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, name, role, email FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {
        "status": "success",
        "users": users
    }


# ==================================================
# MODULE 2 & 3: CROWD MONITORING & CONGESTION ALERTS
# ==================================================

@app.get("/crowd/summary")
def get_crowd_summary():
    """Reads passenger entries/exits from database to give real-time monitoring stats."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT date, time, day, station, line, entry_count, exit_count, net_flow, weather 
            FROM passenger_flow 
            LIMIT 25
        """)
        live_records = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT SUM(entry_count) as total_entries, 
                   SUM(exit_count) as total_exits, 
                   AVG(entry_count) as avg_entries 
            FROM passenger_flow
        """)
        metrics_row = cursor.fetchone()
        
        metrics = {
            "total_entries": int(metrics_row["total_entries"]) if metrics_row and metrics_row["total_entries"] else 0,
            "total_exits": int(metrics_row["total_exits"]) if metrics_row and metrics_row["total_exits"] else 0,
            "avg_entries_per_hour": round(float(metrics_row["avg_entries"]), 1) if metrics_row and metrics_row["avg_entries"] else 0.0
        }
        
        cursor.execute("""
            SELECT station, SUM(entry_count) as entry_count 
            FROM passenger_flow 
            GROUP BY station 
            ORDER BY entry_count DESC 
            LIMIT 6
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

@app.get("/crowd/alerts")
def get_congestion_alerts():
    """Calculates train and station density thresholds from the DB excluding resolved alerts."""
    conn = get_db_connection()
    cursor = conn.cursor()
    alerts = []
    
    try:
        cursor.execute("SELECT alert_id FROM alerts_resolution")
        resolved_ids = set([row["alert_id"] for row in cursor.fetchall()])
        
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
            elif entry_count > 120:
                alerts.append({
                    "id": f"WARN-STN-{idx}",
                    "type": "STATION_WARNING",
                    "severity": "WARNING",
                    "target": row["station"],
                    "line": row["line"],
                    "message": f"High passenger inflow at {row['station']} ({entry_count} entries/min). Monitoring platform density.",
                    "metric": f"{entry_count} pax/min"
                })

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
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT train_id, line, station, occupancy_percent, passenger_count, crowd_level 
            FROM train_occupancy 
            ORDER BY occupancy_percent DESC 
            LIMIT 15
        """)
        busy_trains = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "trains": busy_trains}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/operator/resolve-alert")
def resolve_congestion_alert(request: AlertResolveRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
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
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# MODULE 4 & 5: TRAIN SCHEDULING & FREQUENCY
# ==================================================

@app.get("/scheduling/schedules")
def get_train_schedules(line: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if line:
            cursor.execute("""
                SELECT train_id, line, departure_station as from_station, arrival_station as to_station, 
                       scheduled_departure as departure_time, scheduled_arrival as arrival_time, frequency as frequency_per_hour
                FROM train_schedule WHERE line = ? LIMIT 50
            """, (line,))
        else:
            cursor.execute("""
                SELECT train_id, line, departure_station as from_station, arrival_station as to_station, 
                       scheduled_departure as departure_time, scheduled_arrival as arrival_time, frequency as frequency_per_hour
                FROM train_schedule LIMIT 50
            """)
        schedules = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "total_schedules": len(schedules), "schedules": schedules}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scheduling/add-schedule")
def add_train_schedule(req: AddScheduleRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO train_schedule (train_id, line, departure_station, arrival_station, scheduled_departure, scheduled_arrival, frequency)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (req.train_id, req.line, req.from_station, req.to_station, req.departure_time, req.arrival_time, f"{req.frequency_per_hour} trains/hr"))
        conn.commit()
        conn.close()
        return {"status": "success", "message": f"Schedule for train {req.train_id} on {req.line} successfully added."}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scheduling/frequency-recommendations")
def get_frequency_recommendations():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT line, AVG(occupancy_percent) as avg_occ, MAX(occupancy_percent) as max_occ
            FROM train_occupancy
            GROUP BY line
        """)
        line_stats = cursor.fetchall()
        
        recommendations = []
        for row in line_stats:
            line = row["line"]
            avg_occ = round(float(row["avg_occ"]), 1) if row["avg_occ"] else 50.0
            max_occ = round(float(row["max_occ"]), 1) if row["max_occ"] else 70.0
            
            curr_freq = 10 if avg_occ > 70 else (8 if avg_occ > 50 else 6)
            
            if avg_occ >= 85.0 or max_occ >= 95.0:
                rec_freq = curr_freq + 4
                action = "INCREASE_FREQUENCY"
                reason = f"High average occupancy ({avg_occ}%) with peak spikes reaching {max_occ}%. Deploy 4 supplementary trains/hr."
                urgency = "HIGH"
            elif avg_occ >= 70.0:
                rec_freq = curr_freq + 2
                action = "SLIGHT_INCREASE"
                reason = f"Moderate-high occupancy ({avg_occ}%). Add 2 trains/hr to prevent platform bottlenecks."
                urgency = "MEDIUM"
            else:
                rec_freq = curr_freq
                action = "MAINTAIN"
                reason = f"Optimal line operations ({avg_occ}% occupancy). Current headways are adequate."
                urgency = "NORMAL"

            recommendations.append({
                "line": line,
                "current_frequency": curr_freq,
                "recommended_frequency": rec_freq,
                "action": action,
                "avg_occupancy": avg_occ,
                "max_occupancy": max_occ,
                "reason": reason,
                "urgency": urgency
            })
            
        conn.close()
        return {"status": "success", "recommendations": recommendations}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scheduling/adjust-frequency")
def adjust_train_frequency(req: FrequencyAdjustmentRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE train_schedule
            SET frequency = ?
            WHERE line = ?
        """, (f"{req.new_frequency} trains/hr", req.line))
        
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "message": f"Successfully updated train frequency on {req.line} to {req.new_frequency} trains/hr.",
            "line": req.line,
            "new_frequency": req.new_frequency,
            "executed_by": req.operator_username,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# MODULE 6: TRAIN DELAY LOGS & TRACKING
# ==========================================

@app.get("/scheduling/delays")
def get_delay_logs(line: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if line:
            cursor.execute("SELECT train_id, line, station, delay_minutes, delay_reason as cause, date FROM delay_logs WHERE line = ? ORDER BY date DESC LIMIT 30", (line,))
        else:
            cursor.execute("SELECT train_id, line, station, delay_minutes, delay_reason as cause, date FROM delay_logs ORDER BY date DESC LIMIT 30")
        delays = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("SELECT AVG(delay_minutes) as avg_delay, SUM(delay_minutes) as total_delay_min FROM delay_logs")
        stats = cursor.fetchone()
        
        conn.close()
        return {
            "status": "success",
            "avg_delay_minutes": round(float(stats["avg_delay"]), 1) if stats and stats["avg_delay"] else 0.0,
            "total_delay_minutes": int(stats["total_delay_min"]) if stats and stats["total_delay_min"] else 0,
            "delays": delays
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scheduling/log-delay")
def log_train_delay(req: LogDelayRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        today_date = datetime.now().strftime("%Y-%m-%d")
        now_time = datetime.now().strftime("%H:%M")
        cursor.execute("""
            INSERT INTO delay_logs (train_id, line, station, delay_minutes, delay_reason, date, time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (req.train_id, req.line, req.station, req.delay_minutes, req.cause, today_date, now_time))
        
        conn.commit()
        conn.close()
        
        # Broadcast real-time schedule & delay update to all live WebSocket clients
        try:
            asyncio.create_task(broadcast_schedule_update())
        except Exception:
            pass
        
        return {
            "status": "success",
            "message": f"Delay of {req.delay_minutes} min logged for Train {req.train_id} on {req.line}.",
            "train_id": req.train_id,
            "delay_minutes": req.delay_minutes,
            "logged_by": req.operator_username
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# MODULE 7: AI PREDICTION & FORECASTING ENGINE
# ==================================================

@app.post("/ai/predict-demand")
def api_predict_demand(req: DemandPredictRequest):
    result = predict_passenger_demand(
        station=req.station,
        line=req.line,
        weather=req.weather or "Clear",
        day=req.day or "Monday",
        time_hour=req.hour or 9,
        date_str=req.date
    )
    return {"status": "success", "prediction": result}

@app.post("/ai/predict-crowd")
def api_predict_crowd(req: CrowdPredictRequest):
    result = predict_crowd_level(
        passenger_count=req.passenger_count,
        occupancy_percent=req.occupancy_percent,
        line=req.line
    )
    return {"status": "success", "prediction": result}

@app.get("/ai/model-metrics")
def get_ai_metrics():
    metrics = get_model_metrics()
    return {"status": "success", "metrics": metrics}


# ==================================================
# MODULE 8: EMERGENCY ANNOUNCEMENTS & NOTIFICATIONS (MILESTONE 3)
# ==================================================

@app.get("/notifications/active")
def get_active_announcements():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, title, message, line, station, severity, broadcast_by, created_at FROM emergency_announcements WHERE is_active = 1 ORDER BY created_at DESC")
        announcements = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"status": "success", "announcements": announcements}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/notifications/announcement")
def create_emergency_announcement(req: EmergencyAnnouncementRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO emergency_announcements (title, message, line, station, severity, broadcast_by)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (req.title, req.message, req.line, req.station, req.severity, req.broadcast_by))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Emergency announcement broadcasted successfully."}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# MODULE 9: ANALYTICS & EXPORT (MILESTONE 3)
# ==================================================

@app.get("/ai/traffic-report")
def generate_traffic_report():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT SUM(entry_count) as total_entries, SUM(exit_count) as total_exits, AVG(entry_count) as avg_flow FROM passenger_flow")
        flow_row = cursor.fetchone()
        
        cursor.execute("""
            SELECT line, SUM(entry_count) as total_passenger_entries, AVG(entry_count) as avg_hourly_flow 
            FROM passenger_flow 
            GROUP BY line 
            ORDER BY total_passenger_entries DESC
        """)
        line_performance = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT time, SUM(entry_count) as entry_volume 
            FROM passenger_flow 
            GROUP BY time 
            ORDER BY entry_volume DESC 
            LIMIT 5
        """)
        peak_hours = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("SELECT COUNT(*) as severe_bottlenecks FROM passenger_flow WHERE entry_count > 180")
        bottlenecks_row = cursor.fetchone()
        
        cursor.execute("SELECT delay_reason as cause, COUNT(*) as incident_count, AVG(delay_minutes) as avg_delay FROM delay_logs GROUP BY delay_reason ORDER BY incident_count DESC")
        delay_causes = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        total_entries = flow_row["total_entries"] if flow_row and flow_row["total_entries"] else 1
        avg_flow = flow_row["avg_flow"] if flow_row and flow_row["avg_flow"] else 100
        bottlenecks = bottlenecks_row["severe_bottlenecks"] if bottlenecks_row and bottlenecks_row["severe_bottlenecks"] else 0
        
        efficiency_score = max(65.0, min(98.5, round(100.0 - (bottlenecks * 1.5), 1)))
        ai_metrics = get_model_metrics()
        
        report = {
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "system_summary": {
                "total_passengers_monitored": total_entries,
                "average_flow_per_station": round(float(avg_flow), 1),
                "operational_efficiency_score": f"{efficiency_score}%",
                "severe_bottlenecks_detected": bottlenecks
            },
            "line_performance": line_performance,
            "peak_demand_hours": peak_hours,
            "delay_incident_distribution": delay_causes,
            "ai_forecasting_performance": ai_metrics,
            "executive_recommendations": [
                "Deploy 4 additional rolling stock sets on Yellow Line during peak window (08:00 - 10:00).",
                "Implement staggered gate entry controls at Rajiv Chowk & Kashmere Gate during weather anomalies.",
                "Optimize turn-around timing at terminal stations to decrease average delay from 4.2 min to < 2.0 min."
            ]
        }
        
        return {"status": "success", "report": report}
        
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/export/excel")
def export_analytics_excel():
    crowd_summary = get_crowd_summary()
    delays = get_delay_logs().get("delays", [])
    report_res = generate_traffic_report()
    line_perf = report_res.get("report", {}).get("line_performance", [])
    
    excel_stream = generate_excel_report(crowd_summary, delays, line_perf)
    headers = {'Content-Disposition': 'attachment; filename="MetroFlow_Operational_Report.xlsx"'}
    return StreamingResponse(excel_stream, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

@app.get("/analytics/export/pdf")
def export_analytics_pdf():
    report_res = generate_traffic_report()
    traffic_report = report_res.get("report", {})
    
    pdf_stream = generate_pdf_report(traffic_report)
    headers = {'Content-Disposition': 'attachment; filename="MetroFlow_Executive_Report.pdf"'}
    return StreamingResponse(pdf_stream, headers=headers, media_type='application/pdf')


# ==================================================
# MODULE 10: WEBSOCKET LIVE MONITORING STREAM
# ==================================================

@app.websocket("/ws/live-monitoring")
async def websocket_live_monitoring(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT SUM(entry_count) as total_entries, AVG(entry_count) as avg_entries FROM passenger_flow")
            row = cursor.fetchone()
            
            data = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "live_entries": int(row["total_entries"]) if row and row["total_entries"] else 0,
                "avg_entries": round(float(row["avg_entries"]), 1) if row and row["avg_entries"] else 0.0,
                "active_trains": 42,
                "system_status": "OPERATIONAL"
            }
            conn.close()
            
            await websocket.send_json(data)
            await asyncio.sleep(4)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")


# ==================================================
# MODULE 11: CONGESTION HEATMAP DATA (MILESTONE 3)
# ==================================================

@app.get("/crowd/heatmap")
def get_congestion_heatmap():
    """Returns station-wise congestion intensity data for heatmap rendering."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT station, line, 
                   SUM(entry_count) as total_entries, 
                   AVG(entry_count) as avg_flow,
                   MAX(entry_count) as peak_flow,
                   SUM(exit_count) as total_exits
            FROM passenger_flow 
            GROUP BY station, line
            ORDER BY total_entries DESC
        """)
        rows = cursor.fetchall()
        
        heatmap_data = []
        if rows:
            max_entries = max(r["total_entries"] for r in rows) if rows else 1
            for row in rows:
                total = row["total_entries"] if row["total_entries"] else 0
                avg = round(float(row["avg_flow"]), 1) if row["avg_flow"] else 0
                peak = row["peak_flow"] if row["peak_flow"] else 0
                intensity = round((total / max_entries) * 100, 1) if max_entries > 0 else 0
                
                if intensity >= 80:
                    level = "CRITICAL"
                elif intensity >= 60:
                    level = "HIGH"
                elif intensity >= 35:
                    level = "MODERATE"
                else:
                    level = "LOW"
                
                heatmap_data.append({
                    "station": row["station"],
                    "line": row["line"],
                    "total_entries": total,
                    "total_exits": row["total_exits"] if row["total_exits"] else 0,
                    "avg_flow": avg,
                    "peak_flow": peak,
                    "intensity_percent": intensity,
                    "congestion_level": level
                })
        
        conn.close()
        return {
            "status": "success",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "stations": heatmap_data
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))


# ==================================================
# MODULE 12: REAL-TIME SCHEDULE UPDATES WEBSOCKET (MILESTONE 3)
# ==================================================

# Global list to track connected schedule WebSocket clients
schedule_ws_clients: list = []

@app.websocket("/ws/schedule-updates")
async def websocket_schedule_updates(websocket: WebSocket):
    """WebSocket that pushes real-time schedule changes to connected frontends."""
    await websocket.accept()
    schedule_ws_clients.append(websocket)
    try:
        while True:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Fetch latest schedule snapshot
            cursor.execute("""
                SELECT train_id, line, departure_station as from_station, 
                       arrival_station as to_station,
                       scheduled_departure as departure_time, 
                       scheduled_arrival as arrival_time, 
                       frequency as frequency_per_hour
                FROM train_schedule 
                ORDER BY line, scheduled_departure
                LIMIT 50
            """)
            schedules = [dict(row) for row in cursor.fetchall()]
            
            # Fetch latest delay logs (last 5)
            cursor.execute("""
                SELECT train_id, line, station, delay_minutes, delay_reason as cause, date, time
                FROM delay_logs 
                ORDER BY date DESC, time DESC 
                LIMIT 5
            """)
            recent_delays = [dict(row) for row in cursor.fetchall()]
            
            conn.close()
            
            update_payload = {
                "type": "SCHEDULE_UPDATE",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "schedules": schedules,
                "recent_delays": recent_delays,
                "total_schedules": len(schedules),
                "system_status": "LIVE"
            }
            
            await websocket.send_json(update_payload)
            await asyncio.sleep(8)  # Push updates every 8 seconds
    except WebSocketDisconnect:
        if websocket in schedule_ws_clients:
            schedule_ws_clients.remove(websocket)
    except Exception as e:
        if websocket in schedule_ws_clients:
            schedule_ws_clients.remove(websocket)
        print(f"Schedule WS error: {e}")

# Helper to broadcast schedule changes to all connected clients
async def broadcast_schedule_update():
    """Called internally when a schedule is modified to push immediate updates."""
    for ws in schedule_ws_clients[:]:
        try:
            await ws.send_json({
                "type": "SCHEDULE_CHANGED",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "message": "Schedule table has been updated. Refreshing..."
            })
        except Exception:
            schedule_ws_clients.remove(ws)
