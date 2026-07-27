import os
from dotenv import load_dotenv
from google import genai

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")



client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_recommendation(station, predicted_passengers, peak_hour):
    prompt = f"""
You are an AI metro operations assistant.

Station: {station}
Predicted Passengers: {predicted_passengers}
Peak Hour: {peak_hour}

Give exactly 4 short recommendations.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    return response.text

def get_ai_chat_response(question):

    prompt = f"""
You are MetroFlow AI Assistant.

You help metro control room operators.

Answer the question professionally.

Question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    return response.text