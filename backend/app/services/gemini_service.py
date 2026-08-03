import asyncio

from google import genai

from app.config import settings


print("=" * 60)
print("Initializing Gemini Service")
print(f"Model: {settings.GEMINI_MODEL}")
print(f"API Key Loaded: {bool(settings.GEMINI_API_KEY)}")

if settings.GEMINI_API_KEY:
    print(f"API Key Prefix: {settings.GEMINI_API_KEY[:10]}...")
else:
    print("ERROR: GEMINI_API_KEY is missing!")

print("=" * 60)


client = genai.Client(api_key=settings.GEMINI_API_KEY)


SYSTEM_PROMPT = """
You are MetroVision AI.

MetroVision is an AI-powered Metro Crowd Management and Scheduling Platform.

Responsibilities:

- Passenger crowd monitoring
- Congestion prediction
- Train scheduling
- Delay analysis
- Operational monitoring
- Emergency response
- Passenger demand forecasting
- Metro analytics
- AI recommendations

Rules:

1. Never answer as a general chatbot.
2. Always assume every conversation is about MetroVision.
3. Base recommendations only on supplied operational information.
4. Never invent passenger counts or station names.
5. Keep responses professional, concise and actionable.
"""


class GeminiService:

    @staticmethod
    async def _generate(prompt: str) -> str:
        """
        Executes a Gemini request safely without blocking FastAPI.
        """

        try:

            print("\n" + "=" * 60)
            print("Sending request to Gemini...")
            print("=" * 60)

            response = await asyncio.to_thread(
                client.models.generate_content,
                model=settings.GEMINI_MODEL,
                contents=prompt,
            )

            print("Gemini response received.")

            if (
                response is not None
                and hasattr(response, "text")
                and response.text
            ):
                return response.text.strip()

            print("Gemini returned an empty response.")
            return "No response generated."

        except Exception as e:

            print("\n" + "=" * 60)
            print("Gemini Error")
            print(type(e).__name__)
            print(str(e))
            print("=" * 60)

            return f"Gemini Error: {str(e)}"

    # ======================================================
    # General Chat
    # ======================================================

    @staticmethod
    async def generate(prompt: str) -> str:

        final_prompt = f"""
{SYSTEM_PROMPT}

User Request:

{prompt}
"""

        return await GeminiService._generate(final_prompt)

    # ======================================================
    # Recommendation
    # ======================================================

    @staticmethod
    async def generate_recommendation(data):

        prompt = f"""
You are MetroVision AI.

Analyze the following metro operational data.

Station Name:
{data.station_name}

Passenger Count:
{data.passenger_count}

Station Capacity:
{data.station_capacity}

Delay Minutes:
{data.delay_minutes}

Peak Hour:
{data.peak_hour}

Occupancy Percentage:
{data.occupancy_percent}

Today's Revenue:
₹{data.revenue_today}

Active Trains:
{data.active_trains}

Return ONLY in this format.

Risk Level:
Summary:
Recommendation:
Operational Action:
Expected Impact:

Rules:

- Risk Level must be Low, Medium, High or Critical.
- Keep under 180 words.
- No markdown.
- No bullet points unless required.
"""

        return await GeminiService._generate(prompt)

    # ======================================================
    # Alert Generator
    # ======================================================

    @staticmethod
    async def generate_alert(data):

        prompt = f"""
You are MetroVision AI.

Generate an operational alert.

Station:
{data.station_name}

Passengers:
{data.passenger_count}

Capacity:
{data.station_capacity}

Delay:
{data.delay_minutes}

Peak Hour:
{data.peak_hour}

Return ONLY:

Alert Level:
Title:
Message:
Immediate Action:
"""

        return await GeminiService._generate(prompt)

    # ======================================================
    # Passenger Announcement
    # ======================================================

    @staticmethod
    async def generate_announcement(data):

        prompt = f"""
You are MetroVision AI.

Create a passenger announcement.

Station:
{data.station_name}

Delay:
{data.delay_minutes}

Passenger Count:
{data.passenger_count}

Maximum 80 words.
Professional tone.
"""

        return await GeminiService._generate(prompt)

    # ======================================================
    # Daily Report
    # ======================================================

    @staticmethod
    async def generate_daily_report(summary):

        prompt = f"""
You are MetroVision AI.

Generate today's operational report.

Data:

{summary}

Include:

1. Overall Performance
2. Key Observations
3. Congestion Analysis
4. Recommendations
5. Future Risks

Maximum 250 words.
"""

        return await GeminiService._generate(prompt)