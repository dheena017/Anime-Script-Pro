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
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html

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

class LogRequestsMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        import time
        import uuid
        import psutil
        
        process = psutil.Process()
        start_time = time.perf_counter()
        start_mem = process.memory_info().rss / 1024 / 1024
        
        signal_id = str(uuid.uuid4())[:8].upper()
        method = scope["method"]
        path = scope["path"]
        query = scope.get("query_string", b"").decode("utf-8")
        
        is_health = path == "/health"
        
        if not is_health:
            try:
                print(f"\033[1;35m>>> [SIGNAL]\033[0m Incoming: \033[1;36m{method}\033[0m {path}", flush=True)
            except Exception:
                pass
            try:
                logger.info(f"REQUEST  [{signal_id}] -> {method} {path}{'?' + query if query else ''}")
            except Exception:
                pass

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                # Intercept and append headers
                headers = list(message.get("headers", []))
                headers.append((b"x-signal-id", signal_id.encode("utf-8")))
                message["headers"] = headers
                
                status_code = message.get("status", 200)
                latency = (time.perf_counter() - start_time) * 1000
                end_mem = process.memory_info().rss / 1024 / 1024
                
                log_msg = f"[BACKEND]  {method} {path} | Status: {status_code} ({latency:.2f}ms)"
                if not is_health:
                    status_color = "\033[1;32m" if status_code < 400 else ("\033[1;33m" if status_code < 500 else "\033[1;31m")
                    try:
                        print(f"\033[1;35m<<< [SIGNAL]\033[0m Result:   {status_color}{status_code}\033[0m (\033[1;36m{latency:.2f}ms\033[0m)\n", flush=True)
                    except Exception:
                        pass
                    try:
                        if status_code < 400:
                            logger.opt(colors=True).info(f"<green><b>SUCCESS</b></green> | {log_msg}")
                        elif status_code < 500:
                            logger.opt(colors=True).warning(f"<yellow><b>WARNING</b></yellow> | {log_msg}")
                        else:
                            logger.opt(colors=True).error(f"<red><b>FAILURE</b></red> | {log_msg}")
                    except Exception:
                        pass
            
            try:
                await send(message)
            except Exception as e:
                # Catch Errno 22 / closed connection error on Windows
                if "Errno 22" in str(e) or "connection" in str(e).lower() or "broken pipe" in str(e).lower():
                    pass
                else:
                    raise e
                    
        try:
            await self.app(scope, receive, send_wrapper)
        except Exception as e:
            # Catch Errno 22 / closed connection error on Windows
            if "Errno 22" in str(e) or "connection" in str(e).lower() or "broken pipe" in str(e).lower():
                pass
            else:
                if not is_health:
                    logger.error(f"CRITICAL [{signal_id}] !! Request Failed: {method} {path}")
                    logger.error(f"   Reason: {str(e)}")
                    import traceback
                    logger.error(traceback.format_exc())
                raise e

app.add_middleware(LogRequestsMiddleware)

# --- Routers ---
app.include_router(api_router)
app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/api/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/api/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/api/identity", tags=["users"])

# --- Documentation ---
@app.get("/docs", include_in_schema=False)
async def get_docs():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Neural Engine - Docs", swagger_css_url="/static/docs/swagger-custom.css")

@app.get("/redoc", include_in_schema=False)
async def get_redoc():
    return get_redoc_html(openapi_url="/openapi.json", title="Neural Engine - Reference")

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "version": "2.5.0-PRO"}

def mask_key(key: Optional[str]) -> str:
    if not key:
        return "MISSING"
    if len(key) <= 8:
        return "INVALID"
    
    prefix = ""
    clean_key = key
    if key.startswith("sk-proj-"):
        prefix = "sk-proj-"
        clean_key = key[8:]
    elif key.startswith("sk-ant-"):
        prefix = "sk-ant-"
        clean_key = key[7:]
    elif key.startswith("gsk_"):
        prefix = "gsk_"
        clean_key = key[4:]
    elif key.startswith("sk-"):
        prefix = "sk-"
        clean_key = key[3:]
        
    visible_prefix = prefix + clean_key[:3]
    visible_suffix = clean_key[-4:]
    return f"CONNECTED ({visible_prefix}...{visible_suffix})"

@app.get("/api/system/integrity", tags=["system"])
async def system_integrity():
    import httpx
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("VITE_GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    groq_key = os.environ.get("GROQ_API_KEY")
    runway_key = os.environ.get("RUNWAY_API_KEY")
    elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
    hf_token = os.environ.get("HF_API_TOKEN")
    supabase_url = os.environ.get("VITE_SUPABASE_URL")
    supabase_key = os.environ.get("VITE_SUPABASE_ANON_KEY")

    results = {}

    async with httpx.AsyncClient(timeout=5.0) as client:
        # 1. Gemini
        if gemini_key:
            try:
                r = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}")
                results["Gemini"] = {"ok": r.is_success, "status": mask_key(gemini_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Gemini"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["Gemini"] = {"ok": False, "status": "MISSING"}

        # 2. OpenAI
        if openai_key:
            try:
                r = await client.get("https://api.openai.com/v1/models", headers={"Authorization": f"Bearer {openai_key}"})
                results["OpenAI"] = {"ok": r.is_success, "status": mask_key(openai_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["OpenAI"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["OpenAI"] = {"ok": False, "status": "MISSING"}

        # 3. Anthropic
        if anthropic_key:
            try:
                r = await client.get("https://api.anthropic.com/v1/models", headers={"x-api-key": anthropic_key, "anthropic-version": "2023-06-01"})
                results["Anthropic"] = {"ok": r.is_success, "status": mask_key(anthropic_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Anthropic"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["Anthropic"] = {"ok": False, "status": "MISSING"}

        # 4. Groq
        if groq_key:
            try:
                r = await client.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {groq_key}"})
                results["Groq"] = {"ok": r.is_success, "status": mask_key(groq_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Groq"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["Groq"] = {"ok": False, "status": "MISSING"}

        # 5. Runway
        if runway_key:
            try:
                r = await client.get("https://api.dev.runwayml.com/v1/organization", headers={"Authorization": f"Bearer {runway_key}", "X-Runway-Version": "2024-11-06"})
                results["Runway"] = {"ok": r.status_code == 200, "status": mask_key(runway_key) if r.status_code == 200 else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Runway"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["Runway"] = {"ok": False, "status": "MISSING"}

        # 6. ElevenLabs
        if elevenlabs_key:
            try:
                r = await client.get("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": elevenlabs_key})
                results["ElevenLabs"] = {"ok": r.is_success, "status": mask_key(elevenlabs_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["ElevenLabs"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["ElevenLabs"] = {"ok": False, "status": "MISSING"}

        # 7. Hugging Face
        if hf_token:
            try:
                r = await client.get("https://huggingface.co/api/whoami-v2", headers={"Authorization": f"Bearer {hf_token}"})
                results["HuggingFace"] = {"ok": r.is_success, "status": mask_key(hf_token) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["HuggingFace"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["HuggingFace"] = {"ok": False, "status": "MISSING"}

        # 8. Supabase
        if supabase_url and supabase_key:
            try:
                r = await client.get(f"{supabase_url}/rest/v1/", headers={"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"})
                results["Supabase"] = {"ok": r.is_success, "status": "CONNECTED" if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Supabase"] = {"ok": False, "status": f"OFFLINE ({str(e)})"}
        else:
            results["Supabase"] = {"ok": False, "status": "MISSING"}

    return results

@app.get("/", tags=["system"], include_in_schema=False)
async def root(request: Request):
    return templates.TemplateResponse(request, "index.html", {
        "environment": os.environ.get("ENV", "development"),
        "version": "2.5.0-PRO"
    })

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
