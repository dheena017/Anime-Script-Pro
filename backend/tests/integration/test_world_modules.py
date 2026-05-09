import pytest
from backend.api import world as world_mod


def _has_route_prefix(router, prefix):
    for r in router.routes:
        if r.path.startswith(prefix):
            return True
    return False


def test_world_module_routes():
    world_router = world_mod.router
    assert _has_route_prefix(world_router, "/api/world/manifest")
    assert _has_route_prefix(world_router, "/api/world/history")
    assert _has_route_prefix(world_router, "/api/world/factions")
    assert _has_route_prefix(world_router, "/api/world/powers")
    assert _has_route_prefix(world_router, "/api/world/architecture")
    assert _has_route_prefix(world_router, "/api/world/atlas")
    assert _has_route_prefix(world_router, "/api/world/culture")
    assert _has_route_prefix(world_router, "/api/world/systems")
