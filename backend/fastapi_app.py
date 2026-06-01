"""
Anime Script Pro — Neural Engine
FastAPI application entry point.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Constants
  5. Logging Configuration
  6. App & Static File Initialization
  7. Middleware (CORS, Rate Limiting, Request Logging)
  8. Router Registration
  9. Utility Functions
 10. HTTP Route Handlers (Docs, Health, System)
 11. WebSocket Handlers
 12. Lifecycle Events (Startup / Shutdown)
 13. Server Entry Point
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
import logging
import os
import sys
import time
import traceback
import uuid
import json
import warnings
from typing import Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
import httpx
import psutil
from fastapi import Depends, FastAPI, HTTPException, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import SQLModel, func, select

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.api import api_router
from backend.api.ai import generate_content
from backend.api.tutorials import seed_tutorials
from backend.database import Tutorial, async_engine, async_session, get_async_session
from backend.schemas import GenerationResponse
from backend.user_manager import UserCreate, UserRead, UserUpdate, auth_backend, fastapi_users
from backend.utils.docs import DESCRIPTION, TAGS_METADATA
from backend.utils.telemetry import install_telemetry_sink, telemetry_manager

# ==============================================================================
# 4. CONSTANTS
# ==============================================================================

# --- Raw Startup Signal (guaranteed terminal visibility before any logger is ready) ---
print("\n\033[1;35m" + "🤖 " + "=" * 74 + " 🤖\033[0m", flush=True)
print("\033[1;36m>>> [NEURAL ENGINE] INITIALIZING MASTER SYSTEM CORE...\033[0m", flush=True)
print("\033[1;36m>>> [NEURAL ENGINE] Active Environment: \033[1;33m" + os.environ.get("ENV", "development").upper() + "\033[0m", flush=True)
print("\033[1;35m" + "🤖 " + "=" * 74 + " 🤖\033[0m\n", flush=True)

BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_VERSION  = "2.5.0-PRO"

# ==============================================================================
# 5. LOGGING CONFIGURATION
# ==============================================================================

def configure_logging() -> None:
    """Configures the unified Loguru logging system with console and file sinks.

    - Console sink  : Colorised DEBUG-level output for developer visibility.
    - File sink     : Plain-text rotating log written to backend/logs/backend.log.
    - Intercept     : Routes uvicorn / SQLAlchemy stdlib loggers into Loguru.
    """
    from pathlib import Path
    import platform

    # Use pathlib for robust Windows path handling (avoids Errno 22)
    log_dir  = Path(__file__).parent.resolve() / "logs"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "backend.log"

    logger.remove()

    # Console sink — high-visibility terminal output at DEBUG level
    logger.add(
        sys.stdout,
        level="DEBUG",
        colorize=True,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
    )

    # File sink — plain-text for auditing and production logs.
    # Windows + multiprocessing + Loguru rotation can trigger OSError [Errno 22]
    # in spawned workers, so keep the sink simple on Windows.
    file_sink_kwargs = {
        "level": "DEBUG",
        "format": "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        "enqueue": True,
    }

    if platform.system().lower() == "windows":
        logger.add(str(log_file), **file_sink_kwargs)
    else:
        logger.add(
            str(log_file),
            rotation="10 MB",
            retention="1 week",
            **file_sink_kwargs,
        )

    # Intercept handler: redirect stdlib loggers into Loguru
    class InterceptHandler(logging.Handler):
        def emit(self, record: logging.LogRecord) -> None:
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno
            logger.opt(depth=6, exception=record.exc_info).log(level, record.getMessage())

    logging.basicConfig(handlers=[InterceptHandler()], level=logging.INFO, force=True)

    # Silence highly verbose database connection/thread-pooling logs
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("aiosqlite").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("watchfiles").setLevel(logging.WARNING)
    logging.getLogger("anyio").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)

    for name in [
        "uvicorn", "uvicorn.error", "uvicorn.access", 
        "fastapi", "sqlalchemy", "aiosqlite", 
        "httpx", "httpcore", "watchfiles", "anyio", "urllib3"
    ]:
        logging.getLogger(name).handlers  = [InterceptHandler()]
        logging.getLogger(name).propagate = False


configure_logging()
warnings.filterwarnings("ignore", category=UserWarning)

# ==============================================================================
# 6. APP & STATIC FILE INITIALIZATION
# ==============================================================================

app = FastAPI(
    title="NEURAL ENGINE",
    description=DESCRIPTION,
    version=APP_VERSION,
    openapi_tags=TAGS_METADATA,
    docs_url=None,   # Custom /docs endpoint defined below
    redoc_url=None,  # Custom /redoc endpoint defined below
)

# Static files — frontend assets and generated media outputs
app.mount("/static", StaticFiles(directory=os.path.join(BACKEND_ROOT, "static")), name="static")

outputs_dir = os.path.join(BACKEND_ROOT, "outputs")
os.makedirs(outputs_dir, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")

# Jinja2 templates for server-rendered HTML (e.g. index.html)
templates = Jinja2Templates(directory=os.path.join(BACKEND_ROOT, "templates"))

# ==============================================================================
# 7. MIDDLEWARE
# ==============================================================================

# --- CORS ---
cors_origins_raw = os.environ.get("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rate Limiting ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


class LogRequestsMiddleware:
    """ASGI middleware that logs every HTTP request with timing and status info.

    - Assigns a unique signal ID to each request (visible in response headers).
    - Logs incoming method + path and outgoing status + latency.
    - Silently drops Windows-specific Errno 22 / broken-pipe connection errors.
    - Skips noisy logging for the /health endpoint.
    """

    def __init__(self, app) -> None:
        self.app = app

    async def __call__(self, scope, receive, send) -> None:
        # Only intercept HTTP requests; pass WebSocket/lifespan scopes through
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        process    = psutil.Process()
        start_time = time.perf_counter()
        signal_id  = str(uuid.uuid4())[:8].upper()
        method     = scope["method"]
        path       = scope["path"]
        query      = scope.get("query_string", b"").decode("utf-8")
        is_health  = path == "/health"

        if not is_health:
            try:
                logger.opt(colors=True).info(
                    f"<magenta>[SIGNAL IN]</magenta>  <cyan><b>{method: <6}</b></cyan> {path}{'?' + query if query else ''} | ID: <yellow>{signal_id}</yellow>"
                )
            except Exception:
                pass

        async def send_wrapper(message):
            """Intercepts the response to inject headers and log the result."""
            if message["type"] == "http.response.start":
                # Append the signal ID as a custom response header
                headers = list(message.get("headers", []))
                headers.append((b"x-signal-id", signal_id.encode("utf-8")))
                message["headers"] = headers

                status_code = message.get("status", 200)
                latency     = (time.perf_counter() - start_time) * 1000

                if not is_health:
                    status_color_tag = (
                        "green" if status_code < 400 else
                        "yellow" if status_code < 500 else
                        "red"
                    )
                    try:
                        logger.opt(colors=True).info(
                            f"<magenta>[SIGNAL OUT]</magenta> <cyan><b>{method: <6}</b></cyan> {path} | "
                            f"Status: <{status_color_tag}><b>{status_code}</b></{status_color_tag}> | "
                            f"Latency: <light-blue>{latency:.2f}ms</light-blue> | ID: <yellow>{signal_id}</yellow>"
                        )
                    except Exception:
                        pass

            try:
                await send(message)
            except Exception as e:
                # Silently swallow Windows closed-connection errors
                if "Errno 22" in str(e) or "connection" in str(e).lower() or "broken pipe" in str(e).lower():
                    pass
                else:
                    raise

        try:
            await self.app(scope, receive, send_wrapper)
        except Exception as e:
            if "Errno 22" in str(e) or "connection" in str(e).lower() or "broken pipe" in str(e).lower():
                pass
            else:
                if not is_health:
                    logger.error(f"CRITICAL [{signal_id}] !! Request Failed: {method} {path}")
                    logger.error(f"   Reason: {str(e)}")
                    logger.error(traceback.format_exc())
                raise


app.add_middleware(LogRequestsMiddleware)

# ==============================================================================
# 8. ROUTER REGISTRATION
# ==============================================================================

app.include_router(api_router)
app.include_router(fastapi_users.get_auth_router(auth_backend),              prefix="/api/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate),  prefix="/api/auth",     tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate),     prefix="/api/identity", tags=["users"])

# ==============================================================================
# 9. UTILITY FUNCTIONS
# ==============================================================================

def mask_key(key: Optional[str]) -> str:
    """Masks an API key for safe logging.

    Returns a string like 'CONNECTED (sk-pro...xyz1)' so logs never expose
    full credentials. Returns 'MISSING' or 'INVALID' for absent/short keys.
    """
    if not key:
        return "MISSING"
    if len(key) <= 8:
        return "INVALID"

    prefix    = ""
    clean_key = key

    if key.startswith("sk-proj-"):
        prefix    = "sk-proj-"
        clean_key = key[8:]
    elif key.startswith("sk-ant-"):
        prefix    = "sk-ant-"
        clean_key = key[7:]
    elif key.startswith("gsk_"):
        prefix    = "gsk_"
        clean_key = key[4:]
    elif key.startswith("sk-"):
        prefix    = "sk-"
        clean_key = key[3:]

    visible_prefix = prefix + clean_key[:3]
    visible_suffix = clean_key[-4:]
    return f"CONNECTED ({visible_prefix}...{visible_suffix})"

# ==============================================================================
# 10. HTTP ROUTE HANDLERS
# ==============================================================================

# --- Documentation ---

@app.get("/docs", include_in_schema=False)
async def get_docs():
    """Serves the custom Swagger UI HTML for interactive API documentation."""
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Neural Engine - Docs",
        swagger_css_url="/static/docs/swagger-custom.css",
    )


@app.get("/redoc", include_in_schema=False)
async def get_redoc():
    """Serves the custom ReDoc HTML for API reference documentation."""
    return get_redoc_html(openapi_url="/openapi.json", title="Neural Engine - Reference")


def _load_script_module(module_name: str):
    """Loads a module from backend/folder_management/ directly by file path using importlib.

    This bypasses sys.path manipulation entirely, which avoids the module-cache
    poisoning problem and is compatible with static analysers (Pylance / pyright).
    """
    import importlib.util
    scripts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "folder_management")
    module_path = os.path.join(scripts_dir, f"{module_name}.py")
    spec   = importlib.util.spec_from_file_location(module_name, module_path)
    module = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(module)                  # type: ignore[union-attr]
    return module


def _trigger_dashboard_rebuild() -> None:
    """Invokes the codebase AST parser pipeline to re-compile the architecture dashboard."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    old_cwd = os.getcwd()
    try:
        # Change CWD to workspace root so relative filesystem scans work correctly
        os.chdir(project_root)
        mod = _load_script_module("build_architecture_dashboard")
        mod.compile_dashboard()
    finally:
        os.chdir(old_cwd)


@app.get("/folder", include_in_schema=False)
async def get_folder(refresh: bool = False):
    """Serves the interactive codebase Neural Studio Architecture dashboard, dynamically compiled on-the-fly."""
    scripts_dir    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "folder_management")
    dashboard_path = os.path.join(scripts_dir, "architecture_dashboard.html")
    
    if refresh or not os.path.exists(dashboard_path):
        try:
            _trigger_dashboard_rebuild()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to dynamically compile dashboard: {e}")
            
    from fastapi.responses import FileResponse
    return FileResponse(dashboard_path)


@app.get("/neural-flow", include_in_schema=False)
async def get_neural_flow(refresh: bool = False):
    # Dummy comment to trigger uvicorn file watch reload
    """Serves the interactive standalone full-screen Global Neural Flow topology map, dynamically compiled on-the-fly."""
    scripts_dir    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "folder_management")
    neural_flow_path = os.path.join(scripts_dir, "Flow.html")
    
    if refresh or not os.path.exists(neural_flow_path):
        try:
            _trigger_dashboard_rebuild()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to dynamically compile Neural Flow workspace: {e}")
            
    from fastapi.responses import FileResponse
    return FileResponse(neural_flow_path)


@app.post("/api/system/rebuild-dashboard", tags=["system"])
async def rebuild_dashboard_api():
    """Triggers codebase AST crawling and re-compiles the Neural Studio Architecture dashboard on the backend."""
    try:
        _trigger_dashboard_rebuild()
        scripts_dir    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "folder_management")
        dashboard_path = os.path.abspath(os.path.join(scripts_dir, "architecture_dashboard.html"))
        return {
            "status": "success",
            "message": "Codebase dashboard visualizer successfully re-compiled.",
            "output_path": dashboard_path
        }
    except Exception as e:
        logger.error(f"[SYSTEM] Failed to dynamically compile dashboard: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to dynamically compile dashboard: {e}")


@app.get("/api/system/read-file", tags=["system"])
async def read_file_api(file_name: str):
    """Reads and returns the contents of system scripts or generated codebase manuals."""
    backend_dir  = os.path.dirname(os.path.abspath(__file__))
    scripts_dir  = os.path.join(backend_dir, "folder_management")
    project_root = os.path.dirname(backend_dir)
    docs_dir     = os.path.join(project_root, "docs")

    # Map allowed logical file names to their physical locations
    allowed_files = {
        "backend_architecture_index.md":  os.path.join(docs_dir,     "backend_architecture_index.md"),
        "frontend_architecture_index.md": os.path.join(docs_dir,     "frontend_architecture_index.md"),
        "build_architecture_dashboard.py":os.path.join(scripts_dir,  "build_architecture_dashboard.py"),
        "scan_backend_index.py":          os.path.join(scripts_dir,  "scan_backend_index.py"),
        "scan_frontend_index.py":         os.path.join(scripts_dir,  "scan_frontend_index.py"),
    }
    if file_name not in allowed_files:
        raise HTTPException(status_code=400, detail="Forbidden file path access.")
        
    file_path = allowed_files[file_name]
    if not os.path.exists(file_path):
        return {"content": f"File {file_name} does not exist."}
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {e}")


@app.post("/api/system/run-script", tags=["system"])
async def run_script_api(script: str):
    """Triggers the execution of system codebase scanners or compiler scripts on-the-fly."""
    import io
    from contextlib import redirect_stdout

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    old_cwd = os.getcwd()

    try:
        os.chdir(project_root)

        f = io.StringIO()
        with redirect_stdout(f):
            if script == "scan_backend":
                mod = _load_script_module("scan_backend_index")
                mod.extract_functions()
                msg = "Codebase backend architectural index successfully updated (backend_architecture_index.md)."
            elif script == "scan_frontend":
                mod = _load_script_module("scan_frontend_index")
                mod.scan_frontend()
                msg = "Codebase frontend architectural index successfully updated (frontend_architecture_index.md)."
            elif script == "compile_dashboard":
                mod = _load_script_module("build_architecture_dashboard")
                mod.compile_dashboard()
                msg = "Studio Architecture dashboard compiled successfully (architecture_dashboard.html)."
            elif script == "rebuild_all":
                _load_script_module("scan_backend_index").extract_functions()
                _load_script_module("scan_frontend_index").scan_frontend()
                _load_script_module("build_architecture_dashboard").compile_dashboard()
                msg = "Codebase indexes regenerated and studio dashboard successfully compiled!"
            else:
                raise HTTPException(status_code=400, detail="Invalid script name specified.")

        output = f.getvalue()
        return {
            "status": "success",
            "message": msg,
            "stdout": output
        }
    except Exception as e:
        logger.error(f"[SYSTEM] Failed to execute script {script}: {e}")
        raise HTTPException(status_code=500, detail=f"Script execution failed: {e}")
    finally:
        os.chdir(old_cwd)


# --- System / Health ---

@app.get("/health", tags=["system"])
async def health_check():
    """Confirm the API and database engine are healthy and return the runtime version."""
    from datetime import datetime
    from sqlalchemy import text as sql_text
    
    db_status = "unhealthy"
    try:
        # Perform a lightweight ping query
        async with async_engine.begin() as conn:
            await conn.execute(sql_text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        logger.error(f"[HEALTH CHECK] Database ping failed: {e}")
        
    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "version": APP_VERSION,
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/system/integrity", tags=["system"])
async def system_integrity():
    """Pings every configured external AI service and reports connection status.

    Reads API keys from environment variables and makes lightweight HTTP calls.
    Returns a dict mapping service name → { ok: bool, status: str }.
    """
    gemini_key     = os.environ.get("GEMINI_API_KEY") or os.environ.get("VITE_GEMINI_API_KEY")
    openai_key     = os.environ.get("OPENAI_API_KEY")
    anthropic_key  = os.environ.get("ANTHROPIC_API_KEY")
    groq_key       = os.environ.get("GROQ_API_KEY")
    runway_key     = os.environ.get("RUNWAY_API_KEY")
    elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
    hf_token       = os.environ.get("HF_API_TOKEN") or os.environ.get("HF_TOKEN")
    hf_image_model = os.environ.get("HF_IMAGE_MODEL")
    supabase_url   = os.environ.get("VITE_SUPABASE_URL")
    supabase_key   = os.environ.get("VITE_SUPABASE_ANON_KEY")

    results: dict = {}

    async with httpx.AsyncClient(timeout=5.0) as client:

        # 1. Gemini
        if gemini_key:
            try:
                r = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}")
                results["Gemini"] = {"ok": r.is_success, "status": mask_key(gemini_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Gemini"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["Gemini"] = {"ok": False, "status": "MISSING"}

        # 2. OpenAI
        if openai_key:
            try:
                r = await client.get("https://api.openai.com/v1/models", headers={"Authorization": f"Bearer {openai_key}"})
                results["OpenAI"] = {"ok": r.is_success, "status": mask_key(openai_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["OpenAI"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["OpenAI"] = {"ok": False, "status": "MISSING"}

        # 3. Anthropic
        if anthropic_key:
            try:
                r = await client.get("https://api.anthropic.com/v1/models", headers={"x-api-key": anthropic_key, "anthropic-version": "2023-06-01"})
                results["Anthropic"] = {"ok": r.is_success, "status": mask_key(anthropic_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Anthropic"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["Anthropic"] = {"ok": False, "status": "MISSING"}

        # 4. Groq
        if groq_key:
            try:
                r = await client.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {groq_key}"})
                results["Groq"] = {"ok": r.is_success, "status": mask_key(groq_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Groq"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["Groq"] = {"ok": False, "status": "MISSING"}

        # 5. Runway
        if runway_key:
            try:
                r = await client.get("https://api.dev.runwayml.com/v1/organization", headers={"Authorization": f"Bearer {runway_key}", "X-Runway-Version": "2024-11-06"})
                results["Runway"] = {"ok": r.status_code == 200, "status": mask_key(runway_key) if r.status_code == 200 else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Runway"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["Runway"] = {"ok": False, "status": "MISSING"}

        # 6. ElevenLabs
        if elevenlabs_key:
            try:
                r = await client.get("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": elevenlabs_key})
                results["ElevenLabs"] = {"ok": r.is_success, "status": mask_key(elevenlabs_key) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["ElevenLabs"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["ElevenLabs"] = {"ok": False, "status": "MISSING"}

        # 7. Hugging Face
        if hf_token:
            try:
                r = await client.get("https://huggingface.co/api/whoami-v2", headers={"Authorization": f"Bearer {hf_token}"})
                results["HuggingFace"] = {"ok": r.is_success, "status": mask_key(hf_token) if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["HuggingFace"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["HuggingFace"] = {"ok": False, "status": "MISSING"}

        # 8. Hugging Face Image Model Configuration
        if hf_image_model:
            results["HuggingFaceImageModel"] = {"ok": True, "status": hf_image_model}
        else:
            results["HuggingFaceImageModel"] = {"ok": False, "status": "DEFAULT black-forest-labs/FLUX.1-schnell"}

        # 9. Supabase
        if supabase_url and supabase_key:
            try:
                r = await client.get(f"{supabase_url}/rest/v1/", headers={"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"})
                results["Supabase"] = {"ok": r.is_success, "status": "CONNECTED" if r.is_success else f"AUTH ERROR ({r.status_code})"}
            except Exception as e:
                results["Supabase"] = {"ok": False, "status": f"OFFLINE ({e})"}
        else:
            results["Supabase"] = {"ok": False, "status": "MISSING"}

    return results


@app.post("/api/system/export-diagnostics", tags=["system"])
async def export_diagnostics(request: Request):
    """Accepts a diagnostics snapshot JSON payload and persists it to disk under outputs/diagnostics_snapshots.

    Returns a JSON response with the saved file path and a URL under the mounted `/outputs` static route.
    """
    try:
        payload = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e}")

    try:
        snapshots_dir = os.path.join(BACKEND_ROOT, "outputs", "diagnostics_snapshots")
        os.makedirs(snapshots_dir, exist_ok=True)
        ts = time.strftime("%Y%m%d-%H%M%S")
        fname = f"diagnostics-snapshot-{ts}-{uuid.uuid4().hex[:6]}.json"
        file_path = os.path.join(snapshots_dir, fname)

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        # Return a URL relative to the mounted /outputs static route so the frontend can link to it
        public_url = f"/outputs/diagnostics_snapshots/{fname}"
        return {"status": "success", "file": file_path, "url": public_url}
    except Exception as e:
        logger.error(f"[SYSTEM] Failed to write diagnostics snapshot: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to write snapshot: {e}")


# --- Root / Frontend ---

@app.get("/", tags=["system"], include_in_schema=False)
async def root(request: Request):
    """Serves the main frontend index.html template at the root URL."""
    return templates.TemplateResponse(request, "index.html", {
        "environment": os.environ.get("ENV", "development"),
        "version": APP_VERSION,
    })

# ==============================================================================
# 11. WEBSOCKET HANDLERS
# ==============================================================================

class ConnectionManager:
    """Manages a pool of active WebSocket connections for real-time broadcasting."""

    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket) -> None:
        """Accepts and registers a new WebSocket client."""
        await ws.accept()
        self.active_connections.append(ws)

    def disconnect(self, ws: WebSocket) -> None:
        """Removes a disconnected client from the pool."""
        self.active_connections.remove(ws)

    async def broadcast(self, msg: str) -> None:
        """Sends a text message to every connected client."""
        for conn in self.active_connections:
            await conn.send_text(msg)


manager = ConnectionManager()


@app.websocket("/ws/templates/notifications")
async def ws_notifications(websocket: WebSocket):
    """WebSocket endpoint — broadcasts general system notifications to the frontend."""
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.websocket("/ws/telemetry")
async def ws_telemetry(websocket: WebSocket):
    """WebSocket endpoint — streams real-time backend logs to the frontend."""
    await telemetry_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)

# ==============================================================================
# 12. LIFECYCLE EVENTS (STARTUP / SHUTDOWN)
# ==============================================================================

@app.on_event("startup")
async def on_startup() -> None:
    """Startup lifecycle hook.

    Steps executed in order:
      1. Check optional video-rendering dependencies (Pillow, moviepy, ffmpeg).
      2. Sync SQLModel metadata → creates any missing database tables.
      3. Auto-seed Tutorial data if the table is empty.
      4. Install the WebSocket telemetry log sink.
    """
    banner = """
<magenta>+------------------------------------------------------------------------------+</magenta>
<magenta>|</magenta>                                                                              <magenta>|</magenta>
<magenta>|</magenta>   <cyan><b>ANIME SCRIPT PRO | NEURAL ENGINE v2.5.0-PRO</b></cyan>                               <magenta>|</magenta>
<magenta>|</magenta>   STATUS: <green><b>INITIALIZING CORE PRODUCTION SUITE...</b></green>                               <magenta>|</magenta>
<magenta>|</magenta>                                                                              <magenta>|</magenta>
<magenta>+------------------------------------------------------------------------------+</magenta>
    """
    logger.opt(colors=True).info(f"\n{banner.strip()}")
    logger.opt(colors=True).info("<cyan>📡 SIGNAL:</cyan> Loading environment and preparing database...")

    # Step 1 — Runtime dependency check for optional video rendering libs
    try:
        import shutil
        missing_deps = []

        try:
            import PIL  # noqa: F401  (Pillow)
        except Exception:
            missing_deps.append("Pillow")

        try:
            import moviepy.editor as _mpy  # type: ignore  # noqa: F401
        except Exception:
            missing_deps.append("moviepy")

        try:
            import imageio_ffmpeg as _iioff  # noqa: F401
        except Exception:
            missing_deps.append("imageio-ffmpeg")

        ffmpeg_path = shutil.which("ffmpeg")
        if not ffmpeg_path:
            try:
                import imageio_ffmpeg as _iio
                possible = _iio.get_ffmpeg_exe()
                if possible:
                    ffmpeg_path = possible
            except Exception:
                pass

        if not ffmpeg_path:
            missing_deps.append("ffmpeg (system executable)")

        if missing_deps:
            logger.opt(colors=True).warning(
                f"<yellow><b>[VIDEO RENDERING]</b></yellow> Missing optional dependencies: <red>{', '.join(missing_deps)}</red>"
            )
            logger.opt(colors=True).warning(
                "<yellow><b>[VIDEO RENDERING]</b></yellow> Install with: <cyan>pip install Pillow moviepy imageio-ffmpeg</cyan> and ensure ffmpeg is on PATH."
            )
        else:
            logger.opt(colors=True).info(
                f"<cyan><b>[VIDEO RENDERING]</b></cyan> All optional deps present (ffmpeg: <green>{ffmpeg_path}</green>)"
            )

    except Exception as e:
        logger.opt(colors=True).debug(f"<cyan><b>[VIDEO RENDERING]</b></cyan> Dependency check failed: {e}")

    # Step 2 — Sync database metadata (creates tables if they don't exist)
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.opt(colors=True).success("<green><b>[DATABASE]</b></green> Metadata synced successfully.")

    # Step 2b — Migrate legacy SQLite cast → character table/column renames (idempotent)
    try:
        from sqlalchemy import text as sql_text
        async with async_engine.begin() as conn:
            # Detect SQLite dialect (no-op on PostgreSQL which handles this via the schema)
            dialect = async_engine.dialect.name
            if dialect == "sqlite":
                # ── Table renames ──────────────────────────────────────────────
                tables = await conn.run_sync(
                    lambda sync_conn: sync_conn.execute(
                        sql_text("SELECT name FROM sqlite_master WHERE type='table'")
                    ).fetchall()
                )
                existing_tables = {row[0] for row in tables}

                if "cast_members" in existing_tables and "characters" not in existing_tables:
                    await conn.execute(sql_text("ALTER TABLE cast_members RENAME TO characters"))
                    logger.opt(colors=True).success("<green><b>[MIGRATION]</b></green> Renamed table <yellow>cast_members</yellow> → <cyan>characters</cyan>")

                if "cast_manifests" in existing_tables and "character_manifests" not in existing_tables:
                    await conn.execute(sql_text("ALTER TABLE cast_manifests RENAME TO character_manifests"))
                    logger.opt(colors=True).success("<green><b>[MIGRATION]</b></green> Renamed table <yellow>cast_manifests</yellow> → <cyan>character_manifests</cyan>")

                # ── Column renames for character_manifests ──────────────────────
                manifest_columns = await conn.run_sync(
                    lambda sync_conn: sync_conn.execute(
                        sql_text("PRAGMA table_info(character_manifests)")
                    ).fetchall()
                )
                manifest_col_names = {row[1] for row in manifest_columns}

                if "cast_list_blob" in manifest_col_names and "character_list_blob" not in manifest_col_names:
                    await conn.execute(sql_text(
                        "ALTER TABLE character_manifests RENAME COLUMN cast_list_blob TO character_list_blob"
                    ))
                    logger.opt(colors=True).success("<green><b>[MIGRATION]</b></green> Renamed column <yellow>cast_list_blob</yellow> → <cyan>character_list_blob</cyan>")

                if "prompt_cast" in manifest_col_names and "prompt_characters" not in manifest_col_names:
                    await conn.execute(sql_text(
                        "ALTER TABLE character_manifests RENAME COLUMN prompt_cast TO prompt_characters"
                    ))
                    logger.opt(colors=True).success("<green><b>[MIGRATION]</b></green> Renamed column <yellow>prompt_cast</yellow> → <cyan>prompt_characters</cyan>")

                # ── Column renames for project_content ─────────────────────────
                pc_columns = await conn.run_sync(
                    lambda sync_conn: sync_conn.execute(
                        sql_text("PRAGMA table_info(project_content)")
                    ).fetchall()
                )
                pc_col_names = {row[1] for row in pc_columns}

                for old, new in [
                    ("cast_profiles", "character_profiles"),
                    ("cast_data", "character_data"),
                    ("cast_relationships", "character_relationships"),
                ]:
                    if old in pc_col_names and new not in pc_col_names:
                        await conn.execute(sql_text(
                            f"ALTER TABLE project_content RENAME COLUMN {old} TO {new}"
                        ))
                        logger.opt(colors=True).success(f"<green><b>[MIGRATION]</b></green> Renamed column <yellow>{old}</yellow> → <cyan>{new}</cyan> in project_content")
        logger.opt(colors=True).success("<green><b>[MIGRATION]</b></green> Legacy cast → character schema migration <green><b>complete</b></green>.")
    except Exception as migration_err:
        logger.opt(colors=True).warning(f"<yellow><b>[MIGRATION]</b></yellow> Non-critical migration step issue: <red>{migration_err}</red>")

    # Step 3 — Auto-seed tutorials if the table is empty
    async with async_session() as session:
        count = (await session.execute(select(func.count(Tutorial.id)))).scalar()
        if count == 0:
            logger.opt(colors=True).warning("<yellow><b>[DATABASE]</b></yellow> Studio data missing. Initializing core templates...")
            await seed_tutorials()
            logger.opt(colors=True).success("<green><b>[DATABASE]</b></green> Studio assets deployed successfully.")
        else:
            logger.opt(colors=True).info(f"<cyan><b>[DATABASE]</b></cyan> Persistence verified (<green>{count}</green> records found).")

    # Step 4 — Install WebSocket telemetry sink (must run after event loop is live)
    install_telemetry_sink()
    
    # Step 5 — Automatically update codebase reference indexes and compile the dashboard on startup
    logger.opt(colors=True).info("<cyan>📡 SIGNAL:</cyan> Auto-compiling codebase reference indexes and architecture dashboard...")
    try:
        def run_compilations():
            # Allow uvicorn to fully bind and become ready first (reduces startup delay)
            time.sleep(1.5)
            project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            old_cwd = os.getcwd()
            try:
                os.chdir(project_root)

                # 1. Update backend architecture index
                try:
                    _load_script_module("scan_backend_index").extract_functions()
                    logger.opt(colors=True).success("<green><b>[INDEX]</b></green> Backend architectural reference index updated successfully (backend_architecture_index.md).")
                except Exception as e:
                    logger.opt(colors=True).error(f"<red><b>[INDEX]</b></red> Failed to generate backend architectural reference index: {e}")

                # 2. Update frontend architecture index
                try:
                    _load_script_module("scan_frontend_index").scan_frontend()
                    logger.opt(colors=True).success("<green><b>[INDEX]</b></green> Frontend architectural reference index updated successfully (frontend_architecture_index.md).")
                except Exception as e:
                    logger.opt(colors=True).error(f"<red><b>[INDEX]</b></red> Failed to generate frontend architectural reference index: {e}")

                # 3. Compile architecture dashboard
                try:
                    _load_script_module("build_architecture_dashboard").compile_dashboard()
                    logger.opt(colors=True).success("<green><b>[DASHBOARD]</b></green> Architecture dashboard compiled successfully (architecture_dashboard.html).")
                except Exception as e:
                    logger.opt(colors=True).error(f"<red><b>[DASHBOARD]</b></red> Failed to compile architecture dashboard: {e}")
            finally:
                os.chdir(old_cwd)
        
        import threading
        threading.Thread(target=run_compilations, daemon=True).start()
    except Exception as e:
        logger.opt(colors=True).error(f"<red><b>[AUTO-STARTUP]</b></red> Failed to trigger codebase crawlers/dashboard compilation: {e}")

    logger.opt(colors=True).success("🚀 <green><b>NEURAL ENGINE ONLINE</b></green>: Production Suite is ready for Architect requests.")
    logger.opt(colors=True).info("<cyan>📡 TELEMETRY:</cyan> Live log stream active on ws:/telemetry")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """Shutdown lifecycle hook.

    Steps executed in order:
      1. Drain the async database connection pool.
      2. Allow active WebSocket handles to close gracefully.
      3. Flush the final telemetry log entries.
    """
    logger.opt(colors=True).warning("🔴 <yellow><b>SIGNAL:</b></yellow> Neural Engine shutdown initiated. Starting structural teardown...")

    # Step 1 — Terminate database connection pool
    try:
        logger.opt(colors=True).info("<cyan>📡 SIGNAL [1/3]:</cyan> Terminating database connection pool...")
        await async_engine.dispose()
        logger.opt(colors=True).success("<green><b>[DATABASE]</b></green> Connection pool drained successfully.")
    except Exception as e:
        logger.opt(colors=True).error(f"<red><b>[DATABASE]</b></red> Error during pool disposal: {e}")

    # Step 2 — Allow WebSocket handles to close
    logger.opt(colors=True).info("<cyan>📡 SIGNAL [2/3]:</cyan> Closing active WebSocket streams and notification gates...")
    await asyncio.sleep(0.01)
    logger.opt(colors=True).success("<green><b>[STREAMS]</b></green> All real-time signals disconnected.")

    # Step 3 — Final telemetry flush
    logger.opt(colors=True).info("<cyan>📡 SIGNAL [3/3]:</cyan> Flushing final telemetry buffers to persistent logs...")

    footer = """
<red>+------------------------------------------------------------------------------+</red>
<red>|</red>                                                                              <red>|</red>
<red>|</red>   <yellow><b>ANIME SCRIPT PRO | NEURAL ENGINE OFFLINE</b></yellow>                                  <red>|</red>
<red>|</red>   STATUS: <red><b>CORE DATA STREAMS TERMINATED SUCCESSFULLY</b></red>                          <red>|</red>
<red>|</red>                                                                              <red>|</red>
<red>+------------------------------------------------------------------------------+</red>
    """
    logger.opt(colors=True).warning(f"\n{footer.strip()}")

# ==============================================================================
# 13. SERVER ENTRY POINT
# ==============================================================================

if __name__ == "__main__":
    import uvicorn
    # Resolve host, port, and auto-reload dynamically from environmental configuration
    host_ip = os.getenv("HOST", "0.0.0.0")
    port_num = int(os.getenv("PORT", "8000"))
    env_mode = os.getenv("ENV", "development").lower()
    auto_reload = env_mode in ("development", "dev")
    
    logger.opt(colors=True).info(
        f"<cyan>📡 BOOT:</cyan> Binding server socket to <yellow>{host_ip}:{port_num}</yellow> | reload=<cyan>{auto_reload}</cyan>"
    )
    uvicorn.run("backend.fastapi_app:app", host=host_ip, port=port_num, reload=auto_reload)
