import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


def metro_chat(question, metro_data):
    """
    AI Metro Assistant
    """

    # If no API key, return fallback
    if not api_key:
        return {
            "reply": "Gemini API key not configured."
        }

    try:

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are MetroFlow AI Assistant.

Current Metro Status

Station : {metro_data['Station']}
Passenger Count : {metro_data['Passenger_Count']}
Crowd Level : {metro_data['Crowd_Level']}
Delay : {metro_data['Delay_Minutes']} minutes
Occupancy : {metro_data['Occupancy_Percent']}%

Answer the user's question using ONLY this Metro information.

Question:
{question}

Keep the answer short (2-3 sentences).
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {
            "reply": response.text
        }

    except Exception:

     q = question.lower()

     if "crowd" in q:

        reply = (
            f"{metro_data['Station']} currently has "
            f"{metro_data['Crowd_Level']} crowd with "
            f"{metro_data['Passenger_Count']} passengers."
        )

     elif "travel" in q:

        if metro_data["Crowd_Level"] == "High":
            reply = "Heavy crowd detected. It is better to travel after peak hours."
        else:
            reply = "Yes. Metro services are operating normally."

     elif "delay" in q:

        reply = (
            f"Current train delay is "
            f"{metro_data['Delay_Minutes']} minutes."
        )

     elif "station" in q:

        reply = (
            f"Current station is {metro_data['Station']}."
        )

     elif "time" in q:

        from datetime import datetime

        reply = (
            f"The current system time is "
            f"{datetime.now().strftime('%I:%M %p')}."
        )

     elif "occupancy" in q:

        reply = (
            f"Current occupancy is "
            f"{metro_data['Occupancy_Percent']}%."
        )

     elif "passenger" in q:

        reply = (
            f"There are currently "
            f"{metro_data['Passenger_Count']} passengers at "
            f"{metro_data['Station']}."
        )

     elif "hello" in q or "hi" in q:

        reply = (
            "Hello! I am your Metro AI Assistant. "
            "Ask me about crowd, delays, stations, occupancy or travel."
        )

     else:

        reply = (
            "Sorry, I don't have information about that. "
            "You can ask me about crowd level, delays, passengers, stations or travel."
        )

     return {
        "reply": reply
    }