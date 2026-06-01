from fastapi import APIRouter

# Import all routers from the flat API directory
from .templates import router as templates_router
from .projects import router as projects_router
from .scripts import router as scripts_router
from .users import router as users_router
from .media import router as media_router
from .notifications import router as notifications_router
from .auth import router as auth_router
from .logs import router as logs_router
from .stats import router as stats_router
from .admin import router as admin_router
from .world import router as world_router
from .ai import router as ai_router
from .text import router as text_router
from .agent import router as agent_router
from .image import router as image_router
from .tutorials import router as tutorials_router
from .library import router as library_router
from .seo import router as seo_router
from .community import router as community_router
from .help import router as help_router
from .engine import router as engine_router
from .production import router as production_router
from .todos import router as todos_router
from .growth import router as growth_router
from .episodes import router as episodes_router
from .characters import router as characters_router
from .diagnostic import router as diagnostic_router
from .scenes import router as scenes_router
from .sessions import router as sessions_router
from .audio import router as audio_router

# Create the Master API Router
api_router = APIRouter()

# Include all sub-routers
api_router.include_router(templates_router, tags=["Architect Context"])
api_router.include_router(projects_router, tags=["Production"])
api_router.include_router(scripts_router, tags=["Neural Engine"])
api_router.include_router(users_router, tags=["Architect Context"])
api_router.include_router(media_router, tags=["Production"])
api_router.include_router(notifications_router, tags=["Architect Context"])
api_router.include_router(auth_router, tags=["Auth Protocols"])
api_router.include_router(logs_router, tags=["Neural Admin"])
api_router.include_router(stats_router, tags=["Architect Context"])
api_router.include_router(admin_router, tags=["Neural Admin"])
api_router.include_router(world_router, tags=["World Lore"])
api_router.include_router(ai_router, tags=["Neural Engine"])
api_router.include_router(text_router, tags=["Neural Engine"])
api_router.include_router(agent_router, tags=["Neural Engine"])
api_router.include_router(image_router, tags=["Neural Engine"])
api_router.include_router(tutorials_router, tags=["Architect Context"])
api_router.include_router(library_router, tags=["Production"])
api_router.include_router(seo_router, tags=["Production"])
api_router.include_router(community_router, tags=["Architect Context"])
api_router.include_router(help_router, tags=["Architect Context"])
api_router.include_router(engine_router, tags=["Neural Engine"])
api_router.include_router(production_router, tags=["Production"])
api_router.include_router(todos_router, tags=["Production"])
api_router.include_router(growth_router, tags=["Production"])
api_router.include_router(episodes_router, tags=["Production"])
api_router.include_router(characters_router, tags=["Character Management"])
api_router.include_router(diagnostic_router, tags=["Neural Admin"])
api_router.include_router(scenes_router, tags=["Production"])
api_router.include_router(sessions_router, tags=["Production"])
api_router.include_router(audio_router, tags=["Audio"])
