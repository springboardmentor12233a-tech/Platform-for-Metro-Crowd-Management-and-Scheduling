from src.gemini_service import generate_alert

result = generate_alert(
    "Central Station",
    "High",
    1900,
    8
)

print(result)
# import os
# from dotenv import load_dotenv
# from google import genai

# load_dotenv()

# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents="Hello"
# )

# print(response.text)