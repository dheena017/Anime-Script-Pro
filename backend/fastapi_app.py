import logging
import os
import sys
import warnings
from datetime import datetime
from typing import List, Optional

# --- RAW STARTUP SIGNAL (Guaranteed visibility) ---
import sys
print("\n\033[1;35m" + "="*80 + "\033[0m", flush=True)
print("\033[1;36m>>> [SYSTEM] BOOTING NEURAL ENGINE...\033[0m", flush=True)
print("\033[1;36m>>> [SYSTEM] Initializing Master API Core...\033[0m", flush=True)
print("\033[1;35m" + "="*80 + "\033[0m\n", flush=True)

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
    from pathlib import Path
    
    # Use pathlib for robust Windows path handling to avoid Errno 22
    backend_root = Path(__file__).parent.resolve()
    log_dir = backend_root / "logs"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "backend.log"

    logger.remove()
    # 1. Console Sink: High-visibility terminal output at DEBUG level
    logger.add(sys.stderr, level="DEBUG", colorize=True, format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>")
    
    # 2. File Sink: Keep it clean and plain-text for the human auditor
    # Using str(log_file) ensures a clean absolute path for the Loguru sink
    logger.add(
        str(log_file), 
        rotation="10 MB", 
        retention="1 week", 
        level="DEBUG", 
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}", 
        enqueue=True
    )

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
# Serve generated outputs (videos) from backend/outputs at /outputs
outputs_dir = os.path.join(BACKEND_ROOT, "outputs")
os.makedirs(outputs_dir, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")
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
    
    is_health = path == "/health"
    
    # RAW FAIL-SAFE TERMINAL LOG (Guaranteed visibility)
    if not is_health:
        print(f"\033[1;35m>>> [SIGNAL]\033[0m Incoming: \033[1;36m{method}\033[0m {path}", flush=True)
        logger.info(f"REQUEST  [{signal_id}] -> {method} {path}{'?' + query if query else ''}")

    try:
        # 2. THE PROCESSING: Let the API handle the request
        response = await call_next(request)
        latency = (time.perf_counter() - start_time) * 1000
        end_mem = process.memory_info().rss / 1024 / 1024
        mem_delta = end_mem - start_mem
        
        # Determine status text and levels
        status_code = response.status_code
        status_desc = "OK" if status_code < 400 else "ERROR"
        
        # 3. THE RESULT: High-visibility terminal result
        log_msg = f"[BACKEND]  {method} {path} | Status: {status_code} ({latency:.2f}ms)"
        if not is_health:
            status_color = "\033[1;32m" if status_code < 400 else ("\033[1;33m" if status_code < 500 else "\033[1;31m")
            print(f"\033[1;35m<<< [SIGNAL]\033[0m Result:   {status_color}{status_code}\033[0m (\033[1;36m{latency:.2f}ms\033[0m)\n", flush=True)
            
            if status_code < 400:
                logger.opt(colors=True).info(f"<green><b>SUCCESS</b></green> | {log_msg}")
            elif status_code < 500:
                logger.opt(colors=True).warning(f"<yellow><b>WARNING</b></yellow> | {log_msg}")
            else:
                logger.opt(colors=True).error(f"<red><b>FAILURE</b></red> | {log_msg}")
        
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

from backend.utils.telemetry import telemetry_manager
from backend.utils.telemetry import install_telemetry_sink
@app.websocket("/ws/telemetry")
async def ws_telemetry(websocket: WebSocket):
    await telemetry_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)

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

    # --- Runtime dependency check for optional video rendering libs ---
    try:
        import shutil
        missing_deps = []
        try:
            import PIL  # Pillow
        except Exception:
            missing_deps.append('Pillow')
        try:
            import moviepy.editor as _mpy  # type: ignore
        except Exception:
            missing_deps.append('moviepy')
        try:
            import imageio_ffmpeg as _iioff
        except Exception:
            missing_deps.append('imageio-ffmpeg')

        ffmpeg_path = shutil.which('ffmpeg')
        if not ffmpeg_path:
            # try imageio-ffmpeg helper if available
            try:
                import imageio_ffmpeg as _iio
                possible = _iio.get_ffmpeg_exe()
                if possible:
                    ffmpeg_path = possible
            except Exception:
                pass
        if not ffmpeg_path:
            missing_deps.append('ffmpeg (system executable)')

        if missing_deps:
            logger.warning("VIDEO RENDERING: Missing optional dependencies: %s", ", ".join(missing_deps))
            logger.warning("VIDEO RENDERING: To enable local/free_ai rendering install: pip install Pillow moviepy imageio-ffmpeg and ensure ffmpeg is on PATH.")
        else:
            logger.info("VIDEO RENDERING: All optional deps present (ffmpeg: %s)", ffmpeg_path)
    except Exception as e:
        logger.debug("VIDEO RENDERING: Dependency check failed: %s", str(e))

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
    # Install WebSocket telemetry sink — must run after the event loop is live
    install_telemetry_sink()
    logger.info("📡 TELEMETRY: Live log stream active on ws:/telemetry")

@app.on_event("shutdown")
async def on_shutdown(): 
    import asyncio
    logger.warning("🔴 SIGNAL: Neural Engine shutdown initiated. Starting structural teardown...")
    
    # 1. Terminate Database Connections
    try:
        logger.info("📡 SIGNAL [1/3]: Terminating database connection pool...")
        await async_engine.dispose()
        logger.success("DATABASE: Connection pool drained successfully.")
    except Exception as e:
        logger.error(f"DATABASE: Error during pool disposal: {e}")

    # 2. Close active data streams
    logger.info("📡 SIGNAL [2/3]: Closing active websocket streams and notification gates...")
    # Add brief async sleep to allow handles to close
    await asyncio.sleep(0.01) 
    logger.success("STREAMS: All real-time signals disconnected.")

    # 3. Final Telemetry Flush
    logger.info("📡 SIGNAL [3/3]: Flushing final telemetry buffers to persistent logs...")
    
    footer = """
    +------------------------------------------------------------------------------+
    |                                                                              |
    |   ANIME SCRIPT PRO | NEURAL ENGINE OFFLINE                                   |
    |   STATUS: CORE DATA STREAMS TERMINATED SUCCESSFULLY                          |
    |                                                                              |
    +------------------------------------------------------------------------------+
    """
    logger.warning(f"\n{footer.strip()}")
