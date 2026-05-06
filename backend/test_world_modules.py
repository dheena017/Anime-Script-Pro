import pytest
from backend.services.api.world.manifest import router as manifest_router
from backend.services.api.world.history import router as history_router
from backend.services.api.world.factions import router as factions_router
from backend.services.api.world.powers import router as powers_router
from backend.services.api.world.architecture import router as architecture_router
from backend.services.api.world.atlas import router as atlas_router
from backend.services.api.world.culture import router as culture_router
from backend.services.api.world.systems import router as systems_router

def test_module_routers():
    assert manifest_router.prefix == "/api/world/manifest"
    assert history_router.prefix == "/api/world/history"
    assert factions_router.prefix == "/api/world/factions"
    assert powers_router.prefix == "/api/world/powers"
    assert architecture_router.prefix == "/api/world/architecture"
    assert atlas_router.prefix == "/api/world/atlas"
    assert culture_router.prefix == "/api/world/culture"
    assert systems_router.prefix == "/api/world/systems"
