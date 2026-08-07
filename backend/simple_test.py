from google import genai
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

MODELS = [
    "models/gemini-2.5-flash",
    "models/gemini-flash-latest",
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.0-flash",
]

for model in MODELS:
    print(f"\nTesting {model}")

    try:
        response = client.models.generate_content(
            model=model,
            contents="Reply with exactly: MetroVision OK"
        )

        print("SUCCESS")
        print(response.text)

    except Exception as e:
        print("FAILED")
        print(e)