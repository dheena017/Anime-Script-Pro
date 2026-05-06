from backend.services.ai_engine import ai_engine

class FactionsService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_factions(project_prompt, module_prompt, context, content_type, user_id)

factions_service = FactionsService()
