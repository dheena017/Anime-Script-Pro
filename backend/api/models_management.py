from fastapi import APIRouter
from loguru import logger

router = APIRouter(prefix="/api/models_management", tags=["Models Configuration"])

@router.get("/")
async def get_models():
    """Models Configuration Listing"""
    logger.info("Accessing models management configuration.")
    return {"message": "Models configuration endpoint ready"}
