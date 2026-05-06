import os
from dotenv import load_dotenv
from google import genai

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

def test():
    api_key = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    print("Testing sync")
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest",
            contents="hello"
        )
        print("Success:", response.text)
    except Exception as e:
        print("Error:", type(e).__name__, e)

test()
