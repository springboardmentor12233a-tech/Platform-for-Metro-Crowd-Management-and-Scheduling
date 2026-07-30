from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def generate_response(prompt: str):

    try:

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content":
                    "You are MetroFlow AI Assistant for Smart Metro Management."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.4,
            max_tokens=300

        )

        return completion.choices[0].message.content

    except Exception as e:

        return f"Groq Error : {e}"