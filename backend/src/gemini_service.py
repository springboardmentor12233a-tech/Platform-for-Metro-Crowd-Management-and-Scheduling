import os

try:
    from google import genai

    api_key = os.getenv("GEMINI_API_KEY")

    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        client = None

except Exception:
    client = None


def generate_alert(station, passenger_count, crowd_level, delay):

    # If Gemini is unavailable, return a normal alert
    if client is None:

     if crowd_level == "High":

        return {
            "alert": f"High crowd detected at {station}. Immediate action required.",
            "priority": "High",
            "recommendation": "Increase train frequency and deploy additional staff."
        }

    elif crowd_level == "Medium":

        return {
            "alert": f"Crowd is increasing at {station}. Please monitor the station.",
            "priority": "Medium",
            "recommendation": "Prepare additional trains and monitor passenger flow."
        }

    else:

        return {
            "alert": f"Metro operations are normal at {station}.",
            "priority": "Low",
            "recommendation": "No action required."
        }

    prompt = f"""
Station : {station}
Passenger Count : {passenger_count}
Crowd Level : {crowd_level}
Delay : {delay}

Generate:
1. Alert
2. Priority
3. Recommendation
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text

        return {
            "alert": text,
            "priority": crowd_level,
            "recommendation": "Follow AI recommendation."
        }

    except Exception:

        return {
            "alert": f"High crowd detected at {station}.",
            "priority": crowd_level,
            "recommendation": "Increase train frequency."
        }
def generate_notification(station, passenger_count, crowd_level, delay):

    prompt = f"""
    You are an AI Metro Control System.

    Station: {station}
    Passenger Count: {passenger_count}
    Crowd Level: {crowd_level}
    Delay: {delay} minutes

    Generate a short passenger notification.

    Response should be only one sentence.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text