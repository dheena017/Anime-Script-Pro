from backend.services.ai_engine import ai_engine

class AtlasService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_atlas(project_prompt, module_prompt, context, content_type, user_id)

atlas_service = AtlasService()
