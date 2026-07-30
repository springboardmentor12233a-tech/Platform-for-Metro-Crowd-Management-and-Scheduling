def emergency_prompt(station: str, incident: str, severity: str):

    return f"""
You are MetroFlow AI, an intelligent metro emergency communication assistant.

Generate a professional emergency announcement.

Rules:

1. Keep response between 70-100 words.
2. Calm tone.
3. Mention station name.
4. Mention incident.
5. Mention severity.
6. Tell passengers what to do.
7. Do not create panic.
8. End with "Thank you for your cooperation."

Station:
{station}

Incident:
{incident}

Severity:
{severity}
"""
def smart_alert_prompt(station, passengers, capacity, crowd):

    return f"""
You are MetroFlow AI.

Generate a smart metro alert.

Station: {station}

Passenger Count: {passengers}

Station Capacity: {capacity}

Crowd Level: {crowd}

Generate a response with the following sections:

1. Alert Level
2. Alert Message
3. Passenger Advice
4. Metro Staff Action

Keep it under 120 words.
Professional tone.
Do not create panic.
"""
def schedule_update_prompt(station, line, delay, reason):

    return f"""
You are MetroFlow AI.

Generate a professional metro schedule update.

Station: {station}
Metro Line: {line}
Delay: {delay} minutes
Reason: {reason}

Requirements:
- Keep the response between 70–100 words.
- Mention the station, line, delay, and reason.
- Advise passengers politely.
- End with: "Thank you for your patience."
- Do not create panic.
"""
def operational_insight_prompt(
    station,
    passenger_count,
    capacity,
    crowd_level,
    train_frequency,
    average_wait_time,
):

    return f"""
You are MetroFlow AI.

Generate operational insights for metro operators.

Station: {station}
Passenger Count: {passenger_count}
Capacity: {capacity}
Crowd Level: {crowd_level}
Train Frequency: {train_frequency}
Average Wait Time: {average_wait_time} minutes

Return the response with these sections:

1. Current Situation
2. Operational Risks
3. Recommendations
4. Priority Level

Keep the response under 150 words.
Professional tone.
"""
def analytics_prompt(
    station,
    passenger_count,
    average_wait_time,
    alerts_generated,
    schedule_delays,
):

    return f"""
You are MetroFlow AI.

Generate a metro analytics report.

Station: {station}

Passenger Count: {passenger_count}

Average Wait Time: {average_wait_time} minutes

Alerts Generated: {alerts_generated}

Schedule Delays: {schedule_delays}

Return the report with these sections:

1. Current Situation
2. Key Observations
3. Recommendations
4. Overall Status

Keep it professional.
Maximum 180 words.
"""