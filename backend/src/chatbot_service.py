# import os
# from google import genai
# from dotenv import load_dotenv
# from services.knowledge_base import knowledge

# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")


# def metro_chat(question, metro_data):
#     """
#     AI Metro Assistant
#     """

#     # If no API key, return fallback
#     if not api_key:
#         return {
#             "reply": "Gemini API key not configured."
#         }

#     try:

#         client = genai.Client(api_key=api_key)

#         prompt = f"""
# You are MetroFlow AI Assistant.

# Current Metro Status

# Station : {metro_data['Station']}
# Passenger Count : {metro_data['Passenger_Count']}
# Crowd Level : {metro_data['Crowd_Level']}
# Delay : {metro_data['Delay_Minutes']} minutes
# Occupancy : {metro_data['Occupancy_Percent']}%

# Answer the user's question using ONLY this Metro information.

# Question:
# {question}

# Keep the answer short (2-3 sentences).
# """

#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt
#         )

#         return {
#             "reply": response.text
#         }

#     except Exception:

#      q = question.lower()

#      if "crowd" in q:

#         reply = (
#             f"{metro_data['Station']} currently has "
#             f"{metro_data['Crowd_Level']} crowd with "
#             f"{metro_data['Passenger_Count']} passengers."
#         )

#      elif "travel" in q:

#         if metro_data["Crowd_Level"] == "High":
#             reply = "Heavy crowd detected. It is better to travel after peak hours."
#         else:
#             reply = "Yes. Metro services are operating normally."

#      elif "delay" in q:

#         reply = (
#             f"Current train delay is "
#             f"{metro_data['Delay_Minutes']} minutes."
#         )

#      elif "station" in q:

#         reply = (
#             f"Current station is {metro_data['Station']}."
#         )

#      elif "time" in q:

#         from datetime import datetime

#         reply = (
#             f"The current system time is "
#             f"{datetime.now().strftime('%I:%M %p')}."
#         )

#      elif "occupancy" in q:

#         reply = (
#             f"Current occupancy is "
#             f"{metro_data['Occupancy_Percent']}%."
#         )

#      elif "passenger" in q:

#         reply = (
#             f"There are currently "
#             f"{metro_data['Passenger_Count']} passengers at "
#             f"{metro_data['Station']}."
#         )

#      elif "hello" in q or "hi" in q:

#         reply = (
#             "Hello! I am your Metro AI Assistant. "
#             "Ask me about crowd, delays, stations, occupancy or travel."
#         )

#      else:

#         reply = (
#             "Sorry, I don't have information about that. "
#             "You can ask me about crowd level, delays, passengers, stations or travel."
#         )

#      return {
#         "reply": reply
#     }

import os
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from knowledge_base import knowledge
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


def metro_chat(question, metro_data):
    """
    MetroFlow AI Chatbot
    Uses Gemini API if available.
    Falls back to local AI knowledge if Gemini quota is exceeded.
    """

    q = question.lower().strip()

    # -----------------------------
    # Try Gemini API First
    # -----------------------------
    if api_key:

        try:

            client = genai.Client(api_key=api_key)

            prompt = f"""
You are MetroFlow AI Assistant.

You are an intelligent assistant for a Smart Metro Crowd Management System.

Current Metro Information:

Station : {metro_data['Station']}
Passenger Count : {metro_data['Passenger_Count']}
Crowd Level : {metro_data['Crowd_Level']}
Delay : {metro_data['Delay_Minutes']} minutes
Occupancy : {metro_data['Occupancy_Percent']}%

Instructions:

• Answer naturally.
• Answer any metro-related question.
• If the question is about the current metro status, use the above live data.
• If it is a general metro question, answer using your knowledge.
• Keep answers within 3 sentences.
• Be friendly and helpful.

User Question:
{question}
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return {
                "reply": response.text.strip()
            }

        except Exception:
            # If Gemini fails, continue to local responses
            pass

    # =====================================================
    # LOCAL AI RESPONSES
    # =====================================================

    # Greetings

    if any(word in q for word in ["hi", "hello", "hey"]):

        return {
            "reply":
            "👋 Hello! I'm MetroFlow AI Assistant. Ask me about crowd levels, passengers, schedules, delays, forecasts, tickets, peak hours, or metro services."
        }

    # Crowd

    if "crowd" in q:

        return {
            "reply":
            f"The current crowd level at {metro_data['Station']} is {metro_data['Crowd_Level']} with approximately {metro_data['Passenger_Count']} passengers."
        }

    # Passenger Count

    if "passenger" in q:

        return {
            "reply":
            f"There are currently {metro_data['Passenger_Count']} passengers at {metro_data['Station']}."
        }

    # Delay

    if "delay" in q:

        return {
            "reply":
            f"The current train delay is {metro_data['Delay_Minutes']} minutes."
        }

    # Occupancy

    if "occupancy" in q or "capacity" in q:

        return {
            "reply":
            f"The current occupancy is {metro_data['Occupancy_Percent']}%."
        }

    # Station

    if "station" in q:

        return {
            "reply":
            f"The current monitored station is {metro_data['Station']}."
        }

    # Travel Advice

    if "travel" in q or "safe" in q:

        if metro_data["Crowd_Level"] == "High":

            return {
                "reply":
                "Heavy crowd detected. It is advisable to travel after peak hours if possible."
            }

        elif metro_data["Crowd_Level"] == "Medium":

            return {
                "reply":
                "Moderate crowd detected. You can travel, but expect some waiting."
            }

        else:

            return {
                "reply":
                "Metro services are operating normally. This is a good time to travel."
            }

    # Time

    if "time" in q:

        return {
            "reply":
            f"The current system time is {datetime.now().strftime('%I:%M %p')}."
        }

    # Peak Hour

    if "peak" in q:

        return {
            "reply":
            "Peak metro hours are generally between 8 AM–10 AM and 5 PM–8 PM."
        }

    # Schedule

    if "schedule" in q:

        return {
            "reply":
            "Train schedules are dynamically adjusted according to passenger demand."
        }

    # Forecast

    if "forecast" in q or "future" in q:

        return {
            "reply":
            "MetroFlow uses Machine Learning to forecast passenger demand and optimize train frequency."
        }

    # Ticket

    if "ticket" in q:

        return {
            "reply":
            "Passengers can purchase tickets through ticket counters, metro smart cards, or mobile applications."
        }

    # Smart Card

    if "smart card" in q:

        return {
            "reply":
            "Smart Cards provide faster entry and exit without waiting in ticket queues."
        }

    # Platform

    if "platform" in q:

        return {
            "reply":
            "Platform information is displayed on electronic display boards inside every station."
        }

    # Heatmap

    if "heatmap" in q:

        return {
            "reply":
            "The congestion heatmap visually shows crowd density across metro stations using color indicators."
        }

    # Monitoring

    if "monitor" in q:

        return {
            "reply":
            "MetroFlow continuously monitors passenger count, occupancy, crowd level, delays, and train operations in real time."
        }

    # Analytics

    if "analytics" in q or "report" in q:

        return {
            "reply":
            "Analytics provide passenger statistics, congestion analysis, peak hours, delays, and operational insights."
        }

    # Search in Knowledge Base

    for key, value in knowledge.items():

        if key.lower() in q:

            return {
                "reply": value
            }

    # Default Reply

    return {
        "reply":
        "I can help with metro-related questions such as:\n\n"
        "• Current Crowd\n"
        "• Passenger Count\n"
        "• Train Delay\n"
        "• Peak Hours\n"
        "• Forecast\n"
        "• Schedule\n"
        "• Occupancy\n"
        "• Heatmap\n"
        "• Smart Card\n"
        "• Ticket Information\n"
        "• Platform Information\n"
        "• Metro Services\n\n"
        "Please ask a metro-related question."
    }