from backend.services.ai_engine import ai_engine

class SystemsService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_systems(project_prompt, module_prompt, context, content_type, user_id)

systems_service = SystemsService()
