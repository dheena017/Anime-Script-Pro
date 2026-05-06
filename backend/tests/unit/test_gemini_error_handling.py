import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

async def test():
    api_key = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    print("Testing aio with bad model name")
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents="hello"
        )
        print("Success:", response.text)
    except Exception as e:
        print("Error:", type(e).__name__, e)

asyncio.run(test())
