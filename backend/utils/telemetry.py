from typing import List
from fastapi import WebSocket
import asyncio
import json
from datetime import datetime

class TelemetryManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._loop: asyncio.AbstractEventLoop | None = None

    def set_loop(self, loop: asyncio.AbstractEventLoop):
        """Store the running event loop so the sync Loguru sink can schedule coroutines."""
        self._loop = loop

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, log_entry: dict):
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

    async def broadcast_event(self, event_type: str, module: str, message: str, payload: dict = None):
        """Send a structured event to all connected clients."""
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

    def emit(self, message) -> None:
        """
        Loguru sink — called synchronously for every log record.
        Schedules a broadcast on the running asyncio event loop.
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
        # thread-safe: schedule on the event loop from the sync Loguru thread
        asyncio.run_coroutine_threadsafe(self.broadcast(entry), self._loop)

# Global instance
telemetry_manager = TelemetryManager()


# Keep track of the sink ID to avoid duplicates
_telemetry_sink_id = None

def install_telemetry_sink():
    """
    Register the telemetry WebSocket as a Loguru sink.
    Must be called after the asyncio event loop is running (e.g. inside startup).
    """
    global _telemetry_sink_id
    import asyncio as _asyncio
    from loguru import logger
    
    # If sink is already installed, don't add another one
    if _telemetry_sink_id is not None:
        return

    try:
        loop = _asyncio.get_running_loop()
        telemetry_manager.set_loop(loop)
        
        # Filter out noisy system modules to keep the HUD clean
        def telemetry_filter(record):
            # Only allow application-level modules and important engine signals
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
    except RuntimeError:
        pass  # No running loop yet — will be called again on startup

