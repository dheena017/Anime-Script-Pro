from backend.ai_engine import ai_engine

class CultureService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_culture(project_prompt, module_prompt, context, content_type, user_id)

culture_service = CultureService()
