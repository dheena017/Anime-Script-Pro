import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

def test():
    api_key = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    print("Testing requests")
    try:
        response = requests.post(
            url,
            json={"contents": [{"parts": [{"text": "hello"}]}]},
            timeout=10
        )
        print("Success:", response.json())
    except Exception as e:
        print("Error:", type(e).__name__, e)

test()
