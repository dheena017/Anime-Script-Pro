import logging
import os
import sys
import warnings
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Response, Request, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlmodel import SQLModel, select, func
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.openapi.docs import get_swagger_ui_html

from backend.database import async_engine, async_session, get_async_session, Tutorial
from backend.user_manager import fastapi_users, auth_backend, UserRead, UserCreate, UserUpdate
from backend.schemas import GenerationResponse
from backend.utils.docs import TAGS_METADATA, DESCRIPTION
from backend.api import api_router
from backend.api.ai import generate_content

# --- Neural Logging Configuration ---
def configure_logging():
    BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
    log_dir = os.path.join(BACKEND_ROOT, "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "backend.log")

    logger.remove()
    # 1. Console Sink: Use rich colors for the developer's terminal
    logger.add(sys.stderr, colorize=True, format="<magenta>[ENGINE]</magenta> <green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>")
    
    # 2. File Sink: Keep it clean and plain-text for the human auditor
    logger.add(log_file, rotation="10 MB", retention="1 week", level="DEBUG", format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}", enqueue=True)

    class InterceptHandler(logging.Handler):
        def emit(self, record):
            try: level = logger.level(record.levelname).name
            except ValueError: level = record.levelno
            logger.opt(depth=6, exception=record.exc_info).log(level, record.getMessage())
    for name in ["uvicorn", "uvicorn.error", "uvicorn.access", "fastapi", "sqlalchemy"]:
        logging.getLogger(name).handlers = [InterceptHandler()]
        logging.getLogger(name).propagate = False

configure_logging()
warnings.filterwarnings("ignore", category=UserWarning)

# --- Initialize App ---
app = FastAPI(title="NEURAL ENGINE", description=DESCRIPTION, version="2.5.0-PRO", openapi_tags=TAGS_METADATA, docs_url=None, redoc_url=None)

# --- Static & Templates ---
BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(BACKEND_ROOT, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BACKEND_ROOT, "templates"))

# --- Middleware ---
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.middleware("http")
async def log_requests(request: Request, call_next):
    import time
    import uuid
    import psutil
    process = psutil.Process()
    start_time = time.perf_counter()
    start_mem = process.memory_info().rss / 1024 / 1024
    
    # Generate a tracking ID for this specific request cycle
    signal_id = str(uuid.uuid4())[:8].upper()
    method = request.method
    path = request.url.path
    query = request.url.query
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")

    # 1. THE TRIGGER: Enhanced telemetry for the incoming request
    logger.info(f"REQUEST  [{signal_id}] -> {method} {path}{'?' + query if query else ''}")
    logger.debug(f"METRICS  [{signal_id}] -> Client: {client_ip} | UA: {user_agent[:50]}... | Mem: {start_mem:.1f}MB")

    try:
        # 2. THE PROCESSING: Let the API handle the request
        response = await call_next(request)
        latency = (time.perf_counter() - start_time) * 1000
        end_mem = process.memory_info().rss / 1024 / 1024
        mem_delta = end_mem - start_mem
        
        # Determine status text and levels
        status_code = response.status_code
        status_desc = "OK" if status_code < 400 else "ERROR"
        
        # 3. THE RESULT: Human-readable response log with memory delta
        log_msg = f"RESPONSE [{signal_id}] <- {method} {path} | Status: {status_code} ({status_desc}) | Latency: {latency:.2f}ms | Mem Δ: {mem_delta:+.2f}MB"
        
        if status_code < 400:
            logger.opt(colors=True).info(f"<green>{log_msg}</green>")
        elif status_code < 500:
            logger.opt(colors=True).warning(f"<yellow>{log_msg}</yellow>")
        else:
            logger.opt(colors=True).error(f"<red>{log_msg}</red>")
        
        # Attach the tracking ID to the response headers
        response.headers["X-Signal-ID"] = signal_id
        return response
        
    except Exception as e:
        # 4. THE FAILURE: Catch and loudly log any crashes
        logger.error(f"CRITICAL [{signal_id}] !! Request Failed: {method} {path}")
        logger.error(f"   Reason: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Production Error",
                "detail": str(e),
                "signal_id": signal_id
            }
        )

# --- Routers ---
app.include_router(api_router)
app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/api/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/api/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/api/identity", tags=["users"])
app.post("/api/generate", tags=["AI Engine"], response_model=GenerationResponse)(generate_content)

# --- Documentation ---
@app.get("/docs", include_in_schema=False)
async def get_docs():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Neural Engine - Docs", swagger_css_url="/static/docs/swagger-custom.css")

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "version": "2.5.0-PRO"}

@app.get("/", tags=["system"], include_in_schema=False)
async def root(request: Request):
    return templates.TemplateResponse(request, "index.html")

# --- WebSocket ---
class ConnectionManager:
    def __init__(self): self.active_connections = []
    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)
    def disconnect(self, ws: WebSocket): self.active_connections.remove(ws)
    async def broadcast(self, msg: str):
        for conn in self.active_connections: await conn.send_text(msg)

manager = ConnectionManager()
@app.websocket("/ws/templates/notifications")
async def ws_notifications(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect: manager.disconnect(websocket)

# --- Lifecycle & Seeding ---
@app.on_event("startup")
async def on_startup():
    banner = """
    +------------------------------------------------------------------------------+
    |                                                                              |
    |   ANIME SCRIPT PRO | NEURAL ENGINE v2.5.0-PRO                                |
    |   STATUS: INITIALIZING CORE PRODUCTION SUITE...                              |
    |                                                                              |
    +------------------------------------------------------------------------------+
    """
    logger.info(f"\n{banner.strip()}")
    logger.info("📡 SIGNAL: Loading environment and preparing database...")

    # 1. Sync Metadata
    async with async_engine.begin() as conn: 
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.success("DATABASE: Metadata synced successfully.")
    
    # 2. Auto-Seed (Background Thread)
    async with async_session() as session:
        count = (await session.execute(select(func.count(Tutorial.id)))).scalar()
        if count == 0:
            import anyio
            from backend.scripts.seeds.seed_all import seed_all
            logger.warning("DATABASE: Studio data missing. Initializing core templates...")
            await anyio.to_thread.run_sync(seed_all)
            logger.success("DATABASE: Studio assets deployed successfully.")
        else:
            logger.info(f"DATABASE: Persistence verified ({count} records found).")
    
    logger.success("🚀 NEURAL ENGINE ONLINE: Production Suite is ready for Architect requests.")

@app.on_event("shutdown")
async def on_shutdown(): 
    logger.warning("🔴 SIGNAL: Neural Engine is shutting down. Closing all data streams.")
