from backend.services.ai_engine import ai_engine

class ArchitectureService:
    async def generate(self, project_prompt, module_prompt, context, content_type, user_id):
        return await ai_engine.generate_architecture(project_prompt, module_prompt, context, content_type, user_id)

architecture_service = ArchitectureService()
