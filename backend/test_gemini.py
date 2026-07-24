from src.gemini_service import generate_alert

result = generate_alert(
    "Central Station",
    "High",
    1900,
    8
)

print(result)