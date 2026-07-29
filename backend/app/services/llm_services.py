import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_alert(prediction_data: dict):
    """
    Generates intelligent metro alerts using Gemini.
    """

    prompt = f"""
You are an AI Metro Operations Assistant.

The prediction system has already analyzed the passenger demand.

Prediction Details:

{json.dumps(prediction_data, indent=2)}

IMPORTANT:

The following values are FINAL and MUST NOT be changed.

- Predicted Passengers
- Crowd Level
- Priority
- Platform Status
- Train Interval
- Extra Trains

Your job is ONLY to generate:

1. alert
2. recommendation
3. passenger_advisory
4. notification_type
5. announcement

Return ONLY valid JSON in this exact format.

{{
    "alert": "",
    "recommendation": "",
    "passenger_advisory": "",
    "notification_type": "",
    "announcement": ""
}}

Announcement should be a short public announcement that can be played over the station speakers.

It should be clear, polite, and concise (1-2 sentences).

Rules:

- notification_type should be one of:
  CONGESTION
  WEATHER
  DELAY
  EVENT
  NORMAL

- Do NOT generate priority.
- Do NOT modify crowd level.
- Do NOT modify predicted passengers.
- Do NOT return markdown.
- Do NOT return explanation.

Return JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Gemini Error:", e)

        return {
            "alert": "Unable to generate alert.",
            "recommendation": str(e),
            "passenger_advisory": "",
            "notification_type": "NORMAL",
            "announcement": ""
        }