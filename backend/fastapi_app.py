import logging
import os
import sys
import warnings

# Ensure project root and backend package roots are importable when running this module directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

# Suppress all runtime user warnings during backend startup
warnings.filterwarnings(
    "ignore",
    category=UserWarning,
)

from datetime import datetime
from typing import List, Optional, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status, Response, Request, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from sqlmodel import SQLModel, Session, select
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles


_logging_configured = False

def configure_logging() -> None:
    global _logging_configured
    if _logging_configured:
        return
        
    logger.remove()
    logger.add(
        sys.stderr,
        level="INFO",
        colorize=True,
        format="<magenta>[BACKEND]</magenta> <green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan> - <level>{message}</level>",
        backtrace=False,
        diagnose=False,
    )

    class InterceptHandler(logging.Handler):
        def emit(self, record: logging.LogRecord) -> None:
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno
            frame, depth = logging.currentframe(), 2
            while frame is not None and frame.f_code.co_filename == logging.__file__:
                frame = frame.f_back
                depth += 1
            logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

    intercept_loggers = [
        "uvicorn",
        "uvicorn.error",
        "uvicorn.access",
        "fastapi",
        "sqlalchemy",
        "sqlmodel",
    ]
    for name in intercept_loggers:
        logging.getLogger(name).handlers = [InterceptHandler()]
        logging.getLogger(name).propagate = False

    # Also add a file sink for persistence
    log_file = os.path.join(BACKEND_ROOT, "logs", "backend.log")
    try:
        logger.add(
            log_file,
            rotation="10 MB",
            retention="1 week",
            level="DEBUG",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            enqueue=True, # Use queue for thread-safety and better performance
        )
        logger.info(f"LOGGING: System synchronized. File sink active at {log_file}")
    except Exception as e:
        logger.error(f"LOGGING: Could not initialize file sink: {e}")

    _logging_configured = True


configure_logging()
# (This is also safe when imported as a module.)

from backend.database import engine, async_engine, get_async_session, AsyncSession, Tutorial
from backend.services.user_manager import fastapi_users, auth_backend, UserRead, UserCreate, UserUpdate
from backend.utils.deps import get_auth_user_id
from backend.schemas import GenerationResponse

logger.success("🚀 NEURAL ENGINE: Logging protocols initialized successfully.")

# --- FastAPI app initialization ---
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.pool').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
logging.getLogger('sqlmodel').setLevel(logging.WARNING)

# --- Studio Architect Metadata ---
tags_metadata = [
    {
        "name": "Neural Engine",
        "description": "Core AI synthesis operations for world building, character DNA, and script materialization.",
    },
    {
        "name": "Production",
        "description": "Project lifecycle management and autonomous production cycles.",
    },
    {
        "name": "Architect Context",
        "description": "User profiles, settings, and resource allocation (balances).",
    },
    {
        "name": "Neural Admin",
        "description": "High-level protocols for system administration and user oversight.",
    },
]

app = FastAPI(
    title="NEURAL ENGINE // Studio Architect Suite",
    description="""
## 🚀 Autonomous Production Protocol v2.5.0
**The backbone of Anime Script Pro's generative architecture.**

### 📡 Core Subsystems
* **Lore Oracle**: Narrative consistency and world-building logic.
* **Soul Forge**: Character DNA synthesis and social matrix mapping.
* **Visual Synthesizer**: Prompt engineering and aesthetic enforcement.
* **Motion Choreographer**: Spatial awareness and scene orchestration.

---

### 🛡️ Architect Authorization Protocol
This interface serves as your **Neural Uplink**. It allows you to authenticate and interact with protected production nodes directly.

#### 1. Purpose of the Uplink
The **Neural Uplink** allows architects to bypass third-party terminals (like Postman) and validate protected endpoints in real-time. It is the primary diagnostic interface for high-clearance production tasks.

#### 2. Synchronization Mechanism (JWT)
When you initialize the `Authorize` sequence with your architect credentials:
* **Credential Dispatch**: Swagger UI transmits your identity to the central authentication node (`/api/auth/jwt/login`).
* **Neural Verification**: The backend validates your cryptographic signature.
* **Signal Token Generation**: Upon success, you are issued a **JSON Web Token (JWT)**—a temporary digital VIP pass that grants access to high-tier neural operations.
* **Local Persistence**: The token is stored within your session buffer, ensuring seamless interaction across the entire architect suite.

#### 3. Diagnostic Testing
Once your status is marked as **"Authorized"**:
* You may exit the authorization terminal.
* Every subsequent `Execute` command on locked nodes will automatically attach your **Signal Token** to the request header (`Authorization: Bearer <token>`).
* The system will recognize your architect signature, permitting access to restricted data streams instead of returning a `401 Unauthorized` breach alert.

### 🛠 System Architecture
This API utilizes **Neural Signal Tracing (Signal ID)** for every request.
All endpoints are strictly monitored by the **Studio Monitor** diagnostic layer.
    """,
    version="2.5.0-GODMODE",
    openapi_tags=tags_metadata,
    docs_url=None,   
    redoc_url=None,
    openapi_url="/openapi.json"
)

# Mount local static files for Swagger UI
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Loosen for local development debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# --- SlowAPI Limiter ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded", "error": str(exc)},
    )

# --- Exception Handlers ---
from backend.utils.neural_utils import wrap_neural_response, log_neural_event

def error_response(status_code: int, detail: str, request: Request, error: str = None, body=None):
    signal_id = log_neural_event(f"ERROR: {detail}", category="FAILURE", level="ERROR")
    content = wrap_neural_response({
        "detail": detail,
        "path": request.url.path,
        "error": error,
        "body": body
    }, signal_id=signal_id)
    return JSONResponse(status_code=status_code, content=content)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return error_response(500, "Internal server error", request, error=str(exc))

@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request: Request, exc: FastAPIRequestValidationError):
    return error_response(422, "Validation error", request, error=str(exc), body=exc.body)

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    err_str = str(exc) if getattr(app, 'debug', False) else "A database error occurred."
    return error_response(500, "Database synchronization failure", request, error=err_str)

# --- Custom Swagger UI with Schema Styling ---
@app.get("/docs", include_in_schema=False)
async def get_swagger_ui_with_custom_css():
    """Custom Swagger UI with neural schema styling."""
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Neural Uplink",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_ui_parameters={"url": app.openapi_url},
        swagger_css_url="/static/swagger-custom.css",
    )

@app.get("/redoc", include_in_schema=False)
async def get_redoc_with_custom_styling():
    """ReDoc with neural schema styling."""
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Neural Reference",
    )

# --- Middleware ---
from backend.utils.neural_utils import NeuralTracer

@app.middleware("http")
async def log_requests(request: Request, call_next):
    import time
    start_time = time.perf_counter()
    
    signal_id = NeuralTracer.generate_signal_id()
    method = request.method
    path = request.url.path
    query = request.url.query
    client_ip = request.client.host if request.client else "unknown"
    
    # 1. LOG THE INCOMING REQUEST (The "Trigger")
    print(f"DEBUG: INCOMING {method} {path}")
    logger.info(f"📥 INCOMING [{signal_id}]: {method} {path}{'?' + query if query else ''} from {client_ip}")
    
    try:
        # 2. THE LOGIC (The "Processing")
        response = await call_next(request)
        process_time = (time.perf_counter() - start_time) * 1000
        
        # Determine status color
        if response.status_code < 400:
            status_tag = f"<green>{response.status_code}</green>"
        elif response.status_code < 500:
            status_tag = f"<yellow>{response.status_code}</yellow>"
        else:
            status_tag = f"<red>{response.status_code}</red>"

        # 3. LOG THE OUTGOING RESPONSE (The "Response")
        logger.info(f"📤 OUTGOING [{signal_id}]: {method} {path} | Status: {status_tag} | Latency: {process_time:.2f}ms")
        
        # Add Signal ID to headers for frontend tracing
        response.headers["X-Signal-ID"] = signal_id
        
        return response
    except Exception as e:
        logger.error(f"❌ CRITICAL [{signal_id}]: Cycle broken during {method} {path}")
        logger.error(f"   Reason: {str(e)}")
        raise

# --- Routers ---
from api.templates import router as templates_router
from api.projects import router as projects_router
from api.scripts import router as scripts_router
from api.users import router as users_router
from api.media import router as media_router
from api.notifications import router as notifications_router
from api.auth import router as auth_router
from api.logs import router as logs_router
from api.stats import router as stats_router
from api.admin import router as admin_router
from api.world import router as world_router
from api.ai import router as ai_router
from api.tutorials import router as tutorials_router
from api.library import router as library_router
from api.seo import router as seo_router
from api.community import router as community_router
from api.help import router as help_router
from api.engine import router as engine_router
from api.production import router as production_router
from api.todos import router as todos_router
from api.growth import router as growth_router
from api.episodes import router as episodes_router
from api.cast import router as cast_router

# Core system routes
@app.get("/", tags=["system"])
async def root():
    return {"message": "Welcome to Anime Script Pro API. Visit /docs for documentation.", "status": "online"}

@app.get("/test-reload")
async def test_reload():
    return {"status": "reloaded"}

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}

@app.get("/api/health", tags=["system"], include_in_schema=False)
async def api_health():
    return {"status": "ok"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)



# --- Compatibility Aliases ---
from api.ai import generate_content
app.post("/api/generate", tags=["AI Engine"], response_model=GenerationResponse)(generate_content)

# Include routers with specialized tags
app.include_router(ai_router, tags=["Neural Engine"])
app.include_router(engine_router, tags=["Neural Engine"])
app.include_router(scripts_router, tags=["Neural Engine"])
app.include_router(world_router, tags=["Neural Engine"])

app.include_router(projects_router, tags=["Production"])
app.include_router(production_router, tags=["Production"])
app.include_router(media_router, tags=["Production"])
app.include_router(library_router, tags=["Production"])
app.include_router(seo_router, tags=["Production"])
app.include_router(todos_router, tags=["Production"])
app.include_router(growth_router, tags=["Production"])
app.include_router(episodes_router, tags=["Production"])
app.include_router(cast_router, tags=["Production"])

app.include_router(users_router, tags=["Architect Context"])
app.include_router(notifications_router, tags=["Architect Context"])
app.include_router(stats_router, tags=["Architect Context"])
app.include_router(tutorials_router, tags=["Architect Context"])
app.include_router(help_router, tags=["Architect Context"])
app.include_router(community_router, tags=["Architect Context"])
app.include_router(templates_router, tags=["Architect Context"])

app.include_router(admin_router, tags=["Neural Admin"])
app.include_router(logs_router, tags=["Neural Admin"])

app.include_router(auth_router, tags=["Auth Protocols"])

# FastAPI Users Auth Routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/identity",
    tags=["users"],
)

# --- WebSocket ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/templates/notifications")
async def websocket_template_notifications(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Startup Events ---
@app.on_event("startup")
async def on_startup():
    banner = """
    +------------------------------------------------------------------------------+
    |                                                                              |
    |   ANIME SCRIPT PRO | NEURAL ENGINE v1.0.0                                    |
    |   STATUS: INITIALIZING CORE PRODUCTION SUITE...                              |
    |                                                                              |
    +------------------------------------------------------------------------------+
    """
    logger.info(f"\n{banner.strip()}")

    logger.info("Starting Anime Script Pro backend...")
    logger.info("Loading environment variables and preparing database...")

    # 1. Initialize Database & Sync Metadata (Async)
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.success("DATABASE: Metadata synced successfully.")
    
    # 2. Auto-seed if empty
    from sqlalchemy import func
    async with AsyncSession(async_engine) as session:
        result = await session.execute(select(func.count(Tutorial.id)))
        count = result.scalar()
        if count == 0:
            logger.warning("DATABASE: Studio data missing. Initializing core templates...")
            # We run the seed script in a separate thread to avoid blocking the event loop
            import anyio
            from backend.scripts.seeds.seed_all import seed_all
            try:
                await anyio.to_thread.run_sync(seed_all)
                logger.success("DATABASE: Auto-seeding complete. Studio assets deployed.")
            except Exception as e:
                logger.error(f"DATABASE: Auto-seeding failed: {e}")
        else:
            logger.info(f"DATABASE: Persistence verified ({count} tutorials found). Skipping seed.")

    logger.success("🚀 SYSTEM ONLINE: Anime Script Pro Production Suite is ready for requests.")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Anime Script Pro backend is shutting down.")
