import os
import json
from loguru import logger

class WorldCache:
    def __init__(self, cache_dir="backend/cache/world"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def get_cache_path(self, user_id: str, project_id: int, module: str) -> str:
        return os.path.join(self.cache_dir, f"{user_id}_{project_id}_{module}.json")

    def get(self, user_id: str, project_id: int, module: str):
        path = self.get_cache_path(user_id, project_id, module)
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Cache read error: {e}")
        return None

    def set(self, user_id: str, project_id: int, module: str, data: dict):
        path = self.get_cache_path(user_id, project_id, module)
        try:
            with open(path, "w") as f:
                json.dump(data, f)
        except Exception as e:
            logger.error(f"Cache write error: {e}")

world_cache = WorldCache()
