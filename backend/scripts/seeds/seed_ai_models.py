import os
import sys
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session, select

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.database.models import AIModel

DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

def seed_ai_models():
    print("Seeding dynamic AI models database table with real-world user limits...")
    # Ensure tables are created
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        models = [
            # --- Text Models ---
            AIModel(model_id="gemini-3.1-flash-lite", provider="gemini", display_name="Gemini 3.1 Flash Lite", cost_per_token=0.000000075, is_active=True, is_free=True),
            AIModel(model_id="gemini-2.5-flash", provider="gemini", display_name="Gemini 2.5 Flash", cost_per_token=0.000000075, is_active=True, is_free=True),
            AIModel(model_id="gemini-2.5-pro", provider="gemini", display_name="Gemini 2.5 Pro", cost_per_token=0.00000125, is_active=True, is_free=False),
            AIModel(model_id="gemini-2-flash", provider="gemini", display_name="Gemini 2 Flash", cost_per_token=0.000000075, is_active=True, is_free=True),
            AIModel(model_id="gemini-2-flash-lite", provider="gemini", display_name="Gemini 2 Flash Lite", cost_per_token=0.00000005, is_active=True, is_free=True),
            AIModel(model_id="gemini-3-flash", provider="gemini", display_name="Gemini 3 Flash", cost_per_token=0.000000075, is_active=True, is_free=True),
            AIModel(model_id="gemini-3.5-flash", provider="gemini", display_name="Gemini 3.5 Flash", cost_per_token=0.000000075, is_active=True, is_free=True),
            AIModel(model_id="gemini-3.1-pro", provider="gemini", display_name="Gemini 3.1 Pro", cost_per_token=0.00000125, is_active=True, is_free=False),
            AIModel(model_id="gemini-2.5-flash-lite", provider="gemini", display_name="Gemini 2.5 Flash Lite", cost_per_token=0.00000005, is_active=True, is_free=True),
            
            # --- OpenAI Text Models ---
            AIModel(model_id="gpt-4o", provider="openai", display_name="OpenAI GPT-4o", cost_per_token=0.000005, is_active=True, is_free=False),
            AIModel(model_id="gpt-4o-mini", provider="openai", display_name="OpenAI GPT-4o Mini", cost_per_token=0.00000015, is_active=True, is_free=True),
            AIModel(model_id="gpt-4-turbo", provider="openai", display_name="OpenAI GPT-4 Turbo", cost_per_token=0.00001, is_active=True, is_free=False),
            AIModel(model_id="o1-preview", provider="openai", display_name="OpenAI o1 Preview", cost_per_token=0.000015, is_active=True, is_free=False),
            AIModel(model_id="o1-mini", provider="openai", display_name="OpenAI o1 Mini", cost_per_token=0.000003, is_active=True, is_free=False),

            # --- Audio / TTS Models ---
            AIModel(model_id="gemini-2.5-flash-tts", provider="gemini", display_name="Gemini 2.5 Flash TTS", cost_per_token=0.0000001, is_active=True, is_free=True),
            AIModel(model_id="gemini-2.5-pro-tts", provider="gemini", display_name="Gemini 2.5 Pro TTS", cost_per_token=0.0000015, is_active=True, is_free=False),
            AIModel(model_id="gemini-3.1-flash-tts", provider="gemini", display_name="Gemini 3.1 Flash TTS", cost_per_token=0.0000001, is_active=True, is_free=True),
            AIModel(model_id="gemini-2.5-flash-native-audio", provider="gemini", display_name="Gemini 2.5 Flash Native Audio Dialog", cost_per_token=0.0000001, is_active=True, is_free=True),
            AIModel(model_id="gemini-3-flash-live", provider="gemini", display_name="Gemini 3 Flash Live", cost_per_token=0.0000001, is_active=True, is_free=True),

            # --- Google AI Studio Image Models ---
            AIModel(model_id="gemini-3.1-flash-image-preview", provider="gemini", display_name="Nano Banana 2 (gemini-3.1-flash-image-preview)", cost_per_token=0.000045, is_active=True, is_free=True),
            AIModel(model_id="gemini-2.5-flash-image", provider="gemini", display_name="Nano Banana (gemini-2.5-flash-image)", cost_per_token=0.000039, is_active=True, is_free=True),
            AIModel(model_id="gemini-3-pro-image-preview", provider="gemini", display_name="Nano Banana Pro (gemini-3-pro-image-preview)", cost_per_token=0.000134, is_active=True, is_free=False),

            # --- Google Professional Vertex / Reasoning Image Models ---
            AIModel(model_id="imagen-4-ultra", provider="gemini", display_name="Imagen 4 Ultra", cost_per_token=0.00006, is_active=True, is_free=False),
            AIModel(model_id="imagen-4-fast", provider="gemini", display_name="Imagen 4 Fast", cost_per_token=0.00002, is_active=True, is_free=False),
            AIModel(model_id="gemini-3-pro-image", provider="gemini", display_name="Gemini 3 Pro Image", cost_per_token=0.00008, is_active=True, is_free=False),

            # --- Open-Weight Models ---
            AIModel(model_id="flux-1-schnell", provider="stability", display_name="FLUX.1 (Schnell)", cost_per_token=0.000005, is_active=True, is_free=True),
            AIModel(model_id="stable-diffusion-xl", provider="stability", display_name="Stable Diffusion XL (SDXL)", cost_per_token=0.000005, is_active=True, is_free=True),
            AIModel(model_id="stable-diffusion-3.5", provider="stability", display_name="Stable Diffusion 3.5", cost_per_token=0.00001, is_active=True, is_free=True),

            # --- API Services (Generous Free Tiers) ---
            AIModel(model_id="hugging-face-inference", provider="stability", display_name="Hugging Face Inference API", cost_per_token=0.0, is_active=True, is_free=True),
            AIModel(model_id="deepai", provider="stability", display_name="DeepAI API", cost_per_token=0.0, is_active=True, is_free=True),
            AIModel(model_id="together-ai-replicate", provider="stability", display_name="Together AI / Replicate Proxy", cost_per_token=0.00001, is_active=True, is_free=False),

            # --- Web-Based Generators ---
            AIModel(model_id="leonardo-ai", provider="stability", display_name="Leonardo.ai Portal", cost_per_token=0.0, is_active=True, is_free=True),
            AIModel(model_id="civitai", provider="stability", display_name="Civitai Hub", cost_per_token=0.0, is_active=True, is_free=True),

            # --- Premium Heavyweights (Paid) ---
            AIModel(model_id="flux-2-pro", provider="stability", display_name="FLUX.2 Pro (Black Forest Labs)", cost_per_token=0.00005, is_active=True, is_free=False),
            AIModel(model_id="gpt-image-1.5", provider="openai", display_name="GPT Image 1.5 (OpenAI)", cost_per_token=0.00004, is_active=True, is_free=False),

            # --- Specialized & Niche Leaders (Paid) ---
            AIModel(model_id="recraft-v4", provider="stability", display_name="Recraft V4 (SVG & Raster)", cost_per_token=0.00008, is_active=True, is_free=False),
            AIModel(model_id="ideogram-3.0", provider="stability", display_name="Ideogram 3.0 (Typography King)", cost_per_token=0.00003, is_active=True, is_free=False),
            AIModel(model_id="midjourney-v7", provider="stability", display_name="Midjourney v7 (Cinematic Art)", cost_per_token=0.00005, is_active=True, is_free=False),

            # --- Aggregator APIs (Paid) ---
            AIModel(model_id="fal-ai", provider="stability", display_name="FAL.AI Routing API", cost_per_token=0.00001, is_active=True, is_free=False),
            AIModel(model_id="replicate", provider="stability", display_name="Replicate API Platform", cost_per_token=0.000015, is_active=True, is_free=False),

            # --- Video Models ---
            AIModel(model_id="veo-3-generate", provider="gemini", display_name="Veo 3 Generate", cost_per_token=0.00005, is_active=True, is_free=False),
            AIModel(model_id="veo-3-fast-generate", provider="gemini", display_name="Veo 3 Fast Generate", cost_per_token=0.00002, is_active=True, is_free=True),
            AIModel(model_id="veo-3-lite-generate", provider="gemini", display_name="Veo 3 Lite Generate", cost_per_token=0.00002, is_active=True, is_free=True),

            # --- Other / Specialty Models ---
            AIModel(model_id="gemma-4-26b", provider="groq", display_name="Gemma 4 26B", cost_per_token=0.0000002, is_active=True, is_free=True),
            AIModel(model_id="gemma-4-31b", provider="groq", display_name="Gemma 4 31B", cost_per_token=0.0000002, is_active=True, is_free=True),
            AIModel(model_id="gemini-robotics-er-1.5", provider="gemini", display_name="Gemini Robotics ER 1.5 Preview", cost_per_token=0.00000015, is_active=True, is_free=True),
            AIModel(model_id="gemini-robotics-er-1.6", provider="gemini", display_name="Gemini Robotics ER 1.6 Preview", cost_per_token=0.00000015, is_active=True, is_free=True),
            AIModel(model_id="computer-use-preview", provider="gemini", display_name="Computer Use Preview", cost_per_token=0.0000025, is_active=True, is_free=False),
            AIModel(model_id="gemini-embedding-1", provider="gemini", display_name="Gemini Embedding 1", cost_per_token=0.00000005, is_active=True, is_free=True),
            AIModel(model_id="gemini-embedding-2", provider="gemini", display_name="Gemini Embedding 2", cost_per_token=0.00000005, is_active=True, is_free=True),

            # --- Agents ---
            AIModel(model_id="antigravity", provider="gemini", display_name="Antigravity", cost_per_token=0.000001, is_active=True, is_free=True),
            AIModel(model_id="deep-research-pro", provider="gemini", display_name="Deep Research Pro Preview", cost_per_token=0.000005, is_active=True, is_free=False),

            # --- Legacy / Others ---
            AIModel(model_id="groq/compound", provider="groq", display_name="Groq Compound", cost_per_token=0.0000002, is_active=True, is_free=False),
            AIModel(model_id="groq/compound-mini", provider="groq", display_name="Groq Compound Mini", cost_per_token=0.00000005, is_active=True, is_free=True),
            AIModel(model_id="llama-3.1-8b-instant", provider="groq", display_name="Llama 3.1 8B Instant", cost_per_token=0.00000005, is_active=True, is_free=True),
            AIModel(model_id="llama-3.3-70b-versatile", provider="groq", display_name="Llama 3.3 70B Versatile", cost_per_token=0.00000059, is_active=True, is_free=False),
            AIModel(model_id="whisper-large-v3", provider="groq", display_name="Whisper Large V3 (Audio)", cost_per_token=0.00001, is_active=True, is_free=False),
            AIModel(model_id="whisper-large-v3-turbo", provider="groq", display_name="Whisper Large V3 Turbo (Audio)", cost_per_token=0.000005, is_active=True, is_free=True),
            AIModel(model_id="canopylabs/orpheus-arabic-saudi", provider="nvidia", display_name="Orpheus Arabic Saudi (TTS)", cost_per_token=0.00002, is_active=True, is_free=False),
            AIModel(model_id="canopylabs/orpheus-v1-english", provider="nvidia", display_name="Orpheus English v1 (TTS)", cost_per_token=0.00002, is_active=True, is_free=False),
        ]
        
        for m in models:
            # Check if model exists
            existing = session.exec(select(AIModel).where(AIModel.model_id == m.model_id)).first()
            if not existing:
                session.add(m)
                print(f"-> Added new model: {m.display_name} ({m.model_id})")
            else:
                existing.provider = m.provider
                existing.display_name = m.display_name
                existing.cost_per_token = m.cost_per_token
                existing.is_free = m.is_free
                existing.is_active = True
                session.add(existing)
                print(f"-> Updated existing model: {m.display_name} ({m.model_id})")
        session.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_ai_models()
