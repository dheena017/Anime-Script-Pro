import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

hf_token = os.getenv("HF_API_TOKEN") or os.getenv("HF_TOKEN")
if not hf_token:
    raise RuntimeError(
        "Missing Hugging Face API token. Set HF_API_TOKEN or HF_TOKEN before running this script."
    )

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=hf_token,
)

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V4-Pro:novita",
    messages=[
- "emotional_arc": internal character shift
        {"role": "user", "content": ""}
    ],
)

print(completion.choices[0].message.content)