import os
import sys
from sqlalchemy import create_engine
from sqlmodel import Session, select

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.database.models import AIModel

DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

def seed_ai_models():
    print("Seeding dynamic AI models database table with real-world user limits...")
    with Session(engine) as session:
        models = [
            # Gemini Models
            AIModel(model_id="gemini-2.0-flash", provider="gemini", display_name="Gemini 2.0 Flash", cost_per_token=0.000000075, is_active=True),
            AIModel(model_id="gemini-1.5-pro", provider="gemini", display_name="Gemini 1.5 Pro", cost_per_token=0.00000125, is_active=True),
            AIModel(model_id="gemini-1.5-flash", provider="gemini", display_name="Gemini 1.5 Flash", cost_per_token=0.000000075, is_active=True),
            
            # OpenAI Models
            AIModel(model_id="openai/gpt-oss-120b", provider="openai", display_name="GPT OSS 120B", cost_per_token=0.0000015, is_active=True),
            AIModel(model_id="openai/gpt-oss-20b", provider="openai", display_name="GPT OSS 20B", cost_per_token=0.0000003, is_active=True),
            AIModel(model_id="openai/gpt-oss-safeguard-20b", provider="openai", display_name="GPT OSS Safeguard", cost_per_token=0.0000003, is_active=True),
            
            # Groq Models
            AIModel(model_id="groq/compound", provider="groq", display_name="Groq Compound", cost_per_token=0.0000002, is_active=True),
            AIModel(model_id="groq/compound-mini", provider="groq", display_name="Groq Compound Mini", cost_per_token=0.00000005, is_active=True),
            AIModel(model_id="llama-3.1-8b-instant", provider="groq", display_name="Llama 3.1 8B Instant", cost_per_token=0.00000005, is_active=True),
            AIModel(model_id="llama-3.3-70b-versatile", provider="groq", display_name="Llama 3.3 70B Versatile", cost_per_token=0.00000059, is_active=True),
            AIModel(model_id="meta-llama/llama-4-scout-17b-16e-instruct", provider="groq", display_name="Llama 4 Scout 17B", cost_per_token=0.00000035, is_active=True),
            AIModel(model_id="meta-llama/llama-prompt-guard-2-22m", provider="groq", display_name="Llama Prompt Guard 22M", cost_per_token=0.00000001, is_active=True),
            AIModel(model_id="meta-llama/llama-prompt-guard-2-86m", provider="groq", display_name="Llama Prompt Guard 86M", cost_per_token=0.00000002, is_active=True),
            AIModel(model_id="qwen/qwen3-32b", provider="groq", display_name="Qwen 3 32B", cost_per_token=0.00000015, is_active=True),
            AIModel(model_id="allam-2-7b", provider="groq", display_name="Allam 2 7B Arabic", cost_per_token=0.00000005, is_active=True),
            AIModel(model_id="whisper-large-v3", provider="groq", display_name="Whisper Large V3 (Audio)", cost_per_token=0.00001, is_active=True),
            AIModel(model_id="whisper-large-v3-turbo", provider="groq", display_name="Whisper Large V3 Turbo (Audio)", cost_per_token=0.000005, is_active=True),
            
            # NVIDIA / Custom Models
            AIModel(model_id="canopylabs/orpheus-arabic-saudi", provider="nvidia", display_name="Orpheus Arabic Saudi (TTS)", cost_per_token=0.00002, is_active=True),
            AIModel(model_id="canopylabs/orpheus-v1-english", provider="nvidia", display_name="Orpheus English v1 (TTS)", cost_per_token=0.00002, is_active=True),
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
                existing.is_active = True
                session.add(existing)
                print(f"-> Updated existing model: {m.display_name} ({m.model_id})")
        session.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_ai_models()
