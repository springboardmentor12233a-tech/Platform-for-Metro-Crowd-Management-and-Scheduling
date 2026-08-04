import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import text

# System metrics getters to ground the LLM
def get_metro_telemetry(db: Session):
    try:
        # Get active alerts
        from app.services.alert_service import fetch_system_alerts
        alerts = fetch_system_alerts(limit=5, unresolved_only=True)
        alert_summary = [f"- [{a.get('severity')}] {a.get('message')}" for a in alerts]
        alert_str = "\n".join(alert_summary) if alert_summary else "No active alerts."

        # Count congested stations
        # A station is congested if passenger_count > 1000 in latest hour
        from app.models.passenger_data import PassengerData
        from app.models.station import Station
        
        congested_query = db.query(Station.station_name, PassengerData.passenger_count)\
            .join(PassengerData, Station.station_id == PassengerData.station_id)\
            .filter(PassengerData.passenger_count > 1000)\
            .order_by(PassengerData.created_at.desc())\
            .limit(5).all()
        
        congested_str = ", ".join([f"{name} ({count} passengers)" for name, count in congested_query]) \
            if congested_query else "None (All stations normal)"

        # Delayed trains count
        from app.models.train import Train
        delayed_trains = db.query(Train).filter(Train.status == "Delayed").all()
        delayed_str = ", ".join([t.train_number for t in delayed_trains]) if delayed_trains else "None"

        # Active trains count
        total_trains = db.query(Train).count()
        active_trains = db.query(Train).filter(Train.status == "Active").count()

        return {
            "active_alerts": alert_str,
            "congested_stations": congested_str,
            "delayed_trains": delayed_str,
            "total_trains": total_trains,
            "active_trains": active_trains
        }
    except Exception as e:
        print(f"Error gathering telemetry for Grok: {e}")
        return {
            "active_alerts": "Unavailable",
            "congested_stations": "Unavailable",
            "delayed_trains": "Unavailable",
            "total_trains": 0,
            "active_trains": 0
        }


def ask_grok_copilot(db: Session, message: str, role: str, user_name: str, history: list = []):
    """
    Sends a query to the xAI Grok API, grounded in current DB state.
    """
    api_key = os.getenv("XAI_API_KEY", "")
    model = os.getenv("XAI_MODEL", "grok-2-1212")
    
    # 1. Gather live grounding context from DB
    telemetry = get_metro_telemetry(db)
    
    system_prompt = f"""You are MetroMind, the expert AI operations copilot operating in the MetroFlow Smart City Command Center.
You are chatting with {user_name}, who has the role of '{role}' on the platform.

Here is the real-time grounded telemetry of the MetroFlow system:
- Active Trains: {telemetry['active_trains']} / {telemetry['total_trains']}
- Delayed Trains: {telemetry['delayed_trains']}
- Dynamic Congested Stations: {telemetry['congested_stations']}
- Active Alerts and Emergency Notifications:
{telemetry['active_alerts']}

RULES:
1. Ground your answers in the supplied telemetry.
2. Provide extremely clear, correct, and simple answers. Do not output complex jargon or overcomplicated sentences. Give a direct answer.
3. DO NOT invent missing station statuses, counts, or metrics. If you do not have data, state that it is currently unavailable.
4. Tailor your responses to their role:
   - 'admin': Full access to master data, schedule optimizations, alerts triggering, and user management.
   - 'manager': Access to schedules adjustment, passenger counts monitoring, active alerts, and analytics.
   - 'user': General traveler/passenger assistance, routing guidance, and safety info.
5. Keep explanations concise, professional, and action-oriented. Provide explanations for crowd counts, predictions, congestion peaks, and suggest corrective scheduling actions if appropriate.
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history (up to last 6 messages to stay bounded)
    for h in history[-6:]:
        messages.append({
            "role": "user" if h.get("sender") == "user" else "assistant",
            "content": h.get("text", "")
        })
        
    messages.append({"role": "user", "content": message})
    
    # Check if API key is configured
    if not api_key:
        print("XAI_API_KEY not found. Simulating MetroMind Response.")
        return generate_simulated_grok_response(message, role, telemetry)

    # Call xAI Grok API via urllib
    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "messages": messages,
        "temperature": 0.2
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        # 10 second timeout for responsiveness
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            res_data = json.loads(res_body)
            reply = res_data["choices"][0]["message"]["content"]
            return reply
    except Exception as e:
        print(f"Error calling xAI API: {e}. Falling back to MetroMind simulated response.")
        return generate_simulated_grok_response(message, role, telemetry)


def generate_simulated_grok_response(message: str, role: str, telemetry: dict):
    """
    Local simulation fallback when Grok is offline/unconfigured.
    """
    msg_lower = message.lower()
    
    intro = f"[MetroMind]\n\n"
    
    if "delay" in msg_lower or "train" in msg_lower:
        if telemetry['delayed_trains'] != "None":
            return intro + f"Active delays: {telemetry['delayed_trains']}. We recommend increasing frequency on the affected lines to reduce wait times."
        else:
            return intro + f"All trains are running on schedule. There are currently no delays on the network."
            
    elif "crowd" in msg_lower or "congest" in msg_lower or "heatmap" in msg_lower:
        return intro + f"Current congested stations: {telemetry['congested_stations']}. Please check the alerts center or increase frequency on crowded lines."
        
    elif "alert" in msg_lower or "emergency" in msg_lower:
        return intro + f"Active system notifications:\n{telemetry['active_alerts']}\n\nLet me know if you would like me to draft an announcement."
        
    elif "summary" in msg_lower or "status" in msg_lower or "telemetry" in msg_lower:
        return intro + f"System Summary:\n" \
                       f"- Active Trains: {telemetry['active_trains']} / {telemetry['total_trains']}\n" \
                       f"- Delays: {telemetry['delayed_trains']}\n" \
                       f"- Congested Stations: {telemetry['congested_stations']}\n" \
                       f"- Alerts: {telemetry['active_alerts']}"
                       
    # General fallback
    return intro + f"System status is normal. There are {telemetry['active_trains']} active trains, delayed trains: {telemetry['delayed_trains']}, and congested stations: {telemetry['congested_stations']}."
