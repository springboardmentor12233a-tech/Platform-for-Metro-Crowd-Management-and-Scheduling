import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
def generate_report_analysis(report_data: dict):
    prompt = f"""
    You are an experienced Metro Operations Manager.

    You are provided with today's metro traffic analysis.

    Data:

    {json.dumps(report_data, indent=2)}

    Your task is to generate a professional Traffic Intelligence Report.

    Rules:

    - Do NOT change any numerical values.
    - Use the provided statistics only.
    - Keep the language professional.
    - Write concise management-level insights.

    Return ONLY valid JSON.

    {{
        "executive_summary": "",

        "key_findings": [
            "",
            "",
            ""
        ],

        "operational_recommendations": [
            "",
            "",
            ""
        ]
    }}

    Do not return markdown.

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

        print("Gemini Report Error:", e)

    return {

        "executive_summary":
        "Unable to generate report.",

        "key_findings": [],

        "operational_recommendations": []

    }