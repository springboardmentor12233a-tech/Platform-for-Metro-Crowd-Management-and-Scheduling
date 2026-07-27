from services.gemini_service import get_ai_recommendation

result = get_ai_recommendation(
    station="Rajiv Chowk",
    predicted_passengers=1850,
    peak_hour=True
)

print(result)