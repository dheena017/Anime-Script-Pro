from backend.ai_engine import ai_engine

class PowersService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_powers(project_prompt, module_prompt, context, content_type, user_id)

powers_service = PowersService()
