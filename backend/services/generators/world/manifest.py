from backend.services.ai_engine import ai_engine

class ManifestService:
    async def generate(self, title, project_prompt, tone, content_type, user_id):
        return await ai_engine.generate_manifest(title, project_prompt, tone, content_type, user_id)

manifest_service = ManifestService()
