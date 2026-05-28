"""
Anime Script Pro — Telemetry Management Subsystem

This module handles real-time telemetry streaming, routing Loguru logger sinks directly
to the active developer console overlays via WebSockets.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Telemetry Management Class
  4. Logging Sink Setup and Installation
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
from datetime import datetime
import json
from typing import Any, Dict, List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import WebSocket
from loguru import logger

# ==============================================================================
# 3. TELEMETRY MANAGEMENT CLASS
# ==============================================================================

class TelemetryManager:
    """Manages active WebSocket connections to broadcast logs and events in real-time."""

    def __init__(self) -> None:
        """Initializes self-tracking state variables."""
        self.active_connections: List[WebSocket] = []
        self._loop: Optional[asyncio.AbstractEventLoop] = None

    def set_loop(self, loop: asyncio.AbstractEventLoop) -> None:
        """Store the running event loop so the sync Loguru sink can schedule coroutines.

        Args:
            loop: Active running Asyncio event loop framework instance.
        """
        self._loop = loop

    async def connect(self, websocket: WebSocket) -> None:
        """Register and accept an incoming developer client socket subscription.

        Args:
            websocket: Incoming WebSocket client handle.
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"TELEMETRY: WebSocket client registered. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        """Unregister a dead or disconnected developer client socket subscription.

        Args:
            websocket: Target WebSocket client socket to release.
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"TELEMETRY: WebSocket client released. Remaining active: {len(self.active_connections)}")

    async def broadcast(self, log_entry: Dict[str, Any]) -> None:
        """Send a formatted JSON message payload out to all active socket subscribers.

        Releases dead connections automatically upon transmission exception events.

        Args:
            log_entry: Telemetry log block dictionary to serialize.
        """
        if not self.active_connections:
            return
        dead = []
        for connection in self.active_connections:
            try:
                await connection.send_json(log_entry)
            except Exception:
                dead.append(connection)
        for d in dead:
            self.disconnect(d)

    async def broadcast_event(
        self,
        event_type: str,
        module: str,
        message: str,
        payload: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Broadcast structured developer tracking events to all connected clients.

        Args:
            event_type: Event header code (e.g. PROGRESS, HEALTH).
            module: Target component initiating telemetry (e.g. AI, DB).
            message: Descriptors detail text.
            payload: Key-value attributes block.
        """
        entry = {
            "id": f"{datetime.now().timestamp():.6f}",
            "created_at": datetime.now().isoformat(),
            "type": event_type,
            "module": module.upper(),
            "status": "INFO",
            "message": message,
            **(payload or {})
        }
        await self.broadcast(entry)

    def emit(self, message: Any) -> None:
        """Loguru sink entrypoint. Schedules asynchronous broadcasts from synchronous threads.

        Args:
            message: Wrapped log record string or dictionary from Loguru context.
        """
        if not self.active_connections or self._loop is None or self._loop.is_closed():
            return
        record = message.record
        entry = {
            "id": f"{record['time'].timestamp():.6f}",
            "created_at": record["time"].isoformat(),
            "module": record["name"].split(".")[-1].upper(),
            "status": record["level"].name,
            "message": record["message"],
            "model_used": None,
        }
        # Schedule on the primary async thread loop
        asyncio.run_coroutine_threadsafe(self.broadcast(entry), self._loop)

# Global Telemetry Instance
telemetry_manager = TelemetryManager()

# ==============================================================================
# 4. LOGGING SINK SETUP AND INSTALLATION
# ==============================================================================

# Keep track of the sink ID to avoid duplicates
_telemetry_sink_id: Optional[int] = None

def install_telemetry_sink() -> None:
    """Register the telemetry WebSocket as a Loguru sink.

    Must be called after the primary asyncio event loop is running (typically inside
    app startup dependency procedures).
    """
    global _telemetry_sink_id
    import asyncio as _asyncio
    
    # If sink is already installed, don't add another one
    if _telemetry_sink_id is not None:
        return

    try:
        loop = _asyncio.get_running_loop()
        telemetry_manager.set_loop(loop)
        
        # Filter out noisy system modules to keep the HUD clean
        def telemetry_filter(record: Dict[str, Any]) -> bool:
            noisy_modules = {'H11_IMPL', 'UVICORN', 'ANYIO', 'WATCHFILES', 'HTTP_PROXY'}
            module_name = record["name"].split(".")[-1].upper()
            return module_name not in noisy_modules

        _telemetry_sink_id = logger.add(
            telemetry_manager.emit, 
            level="INFO", 
            format="{message}", 
            filter=telemetry_filter,
            enqueue=False
        )
        logger.info("TELEMETRY: Loguru telemetry sink integrated successfully.")
    except RuntimeError:
        pass  # Loop is not yet active - startup process will re-attempt automatically
